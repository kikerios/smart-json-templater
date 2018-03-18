const config = require('./config')
const Logger = require('bucker').createLogger({
  name: config.get('/name'),
  console: config.get('/logger/options/console'),
})

const Promise = require('bluebird')
const _ = require('lodash')
const jp = require('jsonpath')
const { object: templater } = require('json-templater')

const convert = (template, rules, raw) => {

  const clear = (ignore, value) => {
    if (ignore) {
      return _.omit(value, ignore) // eslint-disable-line
    }
    return value
  }

  const updatePersistent = ({ save, ignore }, nodes, persistents) => {
    const isArrayNodes = (_.isArray(nodes) && _.size(nodes) > 1)
    const newPersistent = _.map(persistents, (persistent) => {
      if (isArrayNodes) {
        return (_.map(nodes, (node) => { // eslint-disable-line
          const merge = _.mergeWith(
            _.cloneDeep(persistent),
            { [save]: clear(ignore, node.value) }, (objValue, srcValue) => {
              if (_.isArray(objValue)) {
                return objValue.concat(srcValue)
              }
              return srcValue
            },
          )
          Logger.debug(merge)
          return merge
        }))
      }
      const node = _.first(nodes)
      return _.set(persistent, save, clear(ignore, node.value)) // eslint-disable-line
    })
    return isArrayNodes ? _.first(newPersistent) : newPersistent
  }

  let counter = 0
  const recursive = (persistent) => {
    const rule = rules[counter++]// eslint-disable-line

    return new Promise((resolve) => {
      if (!rule) {
        return resolve(persistent)
      }

      const {
        xpath,
      } = rule

      const values = jp.nodes(raw, xpath)
      Logger.debug(values)
      persistent = updatePersistent( // eslint-disable-line
        rule,
        values,
        _.isArray(persistent) ? persistent : [persistent],
      )

      return resolve(recursive(persistent))
    })
  }

  return new Promise((resolve, reject) => {
    recursive({})
      .then((results) => {
        Logger.debug('results', JSON.stringify(results))
        const map = _.map(results, (item) => {
          // _.set(item, 'raw', _.cloneDeep(item))
          return templater(template, item)
        })
        // Logger.debug('map', JSON.stringify(map))
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
