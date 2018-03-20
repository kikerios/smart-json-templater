const config = require('./config')
const Logger = require('bucker').createLogger({
  name: config.get('/name'),
  console: config.get('/logger/options/console'),
})

const Promise = require('bluebird')
const _ = require('lodash')
const jp = require('jsonpath-wdf')
const { object: templater } = require('json-templater')

// set jsonpath default value
jp.default({ enable: true, value: null })

const convert = (template, rules, raw) => {

  const clear = (ignore, value) => {
    if (ignore) {
      return _.omit(value, ignore) // eslint-disable-line
    }
    return value
  }

  const updatePersistent = ({ save, ignore }, nodes, persistents) => {
    const isArrayNodes = (_.isArray(nodes) && _.size(nodes) > 1)
    const isArrayPersistent = (_.isArray(persistents) && _.size(persistents) > 1)
    let counterPersistent = 0
    const newPersistent = _.map(persistents, (persistent) => {
      if (isArrayNodes) {
        if (!isArrayPersistent) {
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
            return merge
          }))
        } else { // eslint-disable-line
          const currentNode = nodes[counterPersistent]

          // search node parent array
          const parentPath = _.dropRightWhile(currentNode.path, (o) => { // eslint-disable-line
            return !_.isNumber(o)
          })
          const parent = jp.parent(raw, jp.stringify(parentPath))
          Logger.debug('parent', jp.stringify(parentPath))
          Logger.debug('persistent', persistent)
          const map = (_.map(parent, (child) => { // eslint-disable-line
            const node = nodes[counterPersistent]
            const merge = _.mergeWith(
              _.cloneDeep(persistent),
              { [save]: clear(ignore, node.value) }, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                  return objValue.concat(srcValue)
                }
                return srcValue
              },
            )
            counterPersistent++ // eslint-disable-line
            return merge
          }))

          if (_.size(parent) === 0) {
            counterPersistent++ // eslint-disable-line
          }

          Logger.debug('%j', map)
          return map
        }
      }
      const node = _.first(nodes)
      return _.set(persistent, save, clear(ignore, node.value)) // eslint-disable-line
    })
    if (isArrayPersistent) {
      return _.reduce(newPersistent, (result, value) => {
        return result.concat(value)
      }, [])
    }
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
        const map = _.map(results, (item) => {
          _.set(item, 'raw', _.cloneDeep(item))
          return templater(template, item)
        })
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
