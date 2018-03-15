const config = require('./config')
const Logger = require('bucker').createLogger({
  name: config.get('/name'),
  console: config.get('/logger/options/console'),
})

const Promise = require('bluebird')
const _ = require('lodash')
const { object: templater } = require('json-templater')

const convert = (template, masterRules, raw) => {
  const results = []

  const saving = ({ ignore, save }, persistent, value) => {
    if (save) {
      if (ignore) {
        value = _.omit(value, ignore) // eslint-disable-line
      }
      _.set(persistent, save, value)
    }
    return persistent
  }

  const recursive = (rules, data, persistent) =>
    new Promise((resolve) => {
      let isEnd = false
      Promise.reduce(rules, (persistent, rule) => { // eslint-disable-line
        const {
          root,
          path,
          rules: innerRules,
          end,
        } = rule

        // reset end validation
        isEnd = end

        let source = data // source == data if root == *
        if (root === 'raw') {
          source = raw
        } else if (root !== '/') {
          source = _.get(persistent, root)
        }

        const value = (path && path !== '/') ? _.get(source, path) : source
        const updated = saving(rule, persistent, value)

        if (_.isArray(value) && innerRules) {
          return Promise.each(value, v => recursive(innerRules, v, _.cloneDeep(updated)))
        }
        return updated
      }, persistent).then((result) => {
        if (isEnd) {
          results.push(result)
        }
        resolve(result)
      })
    })

  return new Promise((resolve, reject) => {
    recursive(masterRules, raw, {})
      .then(() => {
        Logger.debug(JSON.stringify(results))
        const map = _.map(results, (item) => {
          _.set(item, 'raw', _.cloneDeep(item))
          return templater(template, item)
        })
        Logger.debug(JSON.stringify(map))
        resolve(map)
      }).catch((error) => {
        Logger.error(error)
        reject(error)
      })
  })
}

module.exports = {
  convert,
}
