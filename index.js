const config = require('./config')
const Logger = require('bucker').createLogger({
  name: config.get('/name'),
  console: config.get('/logger/options/console'),
})

const Promise = require('bluebird')
const _ = require('lodash')
const jp = require('jsonpath')
const { object: templater } = require('json-templater')

// set jsonpath default value
// jp.default({ enable: true, value: null })

const convert = (template, rules, raw) => {

  const clear = (ignore, { value, path }) => {
    // return { value, path: jp.stringify(path) }
    return value
  }

  const parent = path =>
    jp.stringify(_.dropRightWhile(path, (o) => { // eslint-disable-line
      return !_.isNumber(o)
    }))


  const updatePersistent = ({ save, ignore }, nodes, persistents) => {
    const isArrayNodes = (_.isArray(nodes) && _.size(nodes) > 1)
    const isArrayPersistent = (_.isArray(persistents) && _.size(persistents) > 1)
    const newPersistent = _.map(persistents, (persistent) => {
      if (isArrayNodes) {
        if (!isArrayPersistent) {
          return (_.map(nodes, (node) => { // eslint-disable-line
            const splitIn = parent(node.path)
            const merge = _.mergeWith(
              _.cloneDeep(persistent),
              { [save]: clear(ignore, node), __split__in__: [splitIn] }, (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                  return objValue.concat(srcValue)
                }
                return srcValue
              },
            )
            return merge
          }))
        } else { // eslint-disable-line

          // Logger.debug('persistents %j', persistents)
          // Logger.debug('nodes %j', nodes)
          Logger.debug('*******************************************************************************************************')

          const spliter = _.get(persistent, '__split__in__', [])
          Logger.debug('spliter %j', spliter)

          let filters = _.filter(nodes, ({ path }) => {
            let startsWith = false
            const pp = parent(path)
            Logger.debug('xxx pp %j', pp, path)

            _.each(spliter, (split) => {
              if (pp.length === split.length && _.startsWith(pp, split)) {
                startsWith = true
              }
            })
            Logger.debug('xxx startsWith %j', startsWith)

            return startsWith
          })

          Logger.debug('xxx filters %j', filters)

          if (_.size(filters) === 0) {
            filters = _.filter(nodes, ({ path }) => {
              let startsWith = false
              const pp = parent(path)
              Logger.debug('yyy pp %j', pp, path)

              _.each(spliter, (split) => {
                if (_.startsWith(pp, split)) {
                  startsWith = true
                }
              })
              Logger.debug('yyy startsWith %j', startsWith)

              return startsWith
            })
          }

          Logger.debug('yyy filters %j', filters)

          const map = (_.map(filters, (node) => { // eslint-disable-line
            const splitIn = parent(node.path)
            const union = _.union([splitIn], spliter)

            Logger.debug('****************')
            Logger.debug('splitIn %j', splitIn)
            Logger.debug('union %j', union)
            Logger.debug('****************')
            const merge = _.mergeWith(
              _.cloneDeep(persistent),
              { [save]: clear(ignore, node), __split__in__: union }, (objValue, srcValue) => {
                // if (_.isArray(objValue)) {
                //   return objValue.concat(srcValue)
                // }
                return srcValue
              },
            )
            return merge
          }))

          // Logger.debug('%j', map)
          return map
        }
      }
      const node = _.first(nodes)
      return _.set(persistent, save, clear(ignore, node)) // eslint-disable-line
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

      Logger.debug('XXXXXXXXXXXXXXXXXXXXXXXXXXxxxxxxx', xpath, 'xxxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXX')
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
        Logger.info('%j', results)
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
