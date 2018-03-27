const config = require('./config')
const Logger = require('bucker').createLogger({
  name: config.get('/name'),
  console: config.get('/logger/options/console'),
})

const Promise = require('bluebird')
const _ = require('lodash')
const jp = require('jsonpath')
const randomstring = require('randomstring')
const { object: templater, string: render } = require('json-templater')

const convert = (template, rules, data, flatten = true) => {
  const raw = _.cloneDeep(data)
  const SPLIT_KEY = randomstring.generate()

  const parent = path =>
    jp.stringify(_.dropRightWhile(path, o => !_.isNumber(o)))

  const merge = (ctx, save, value, splitter) =>
    _.mergeWith(
      _.cloneDeep(ctx),
      { [save]: value, [SPLIT_KEY]: splitter },
    )

  const updateContext = (save, nodes, context) => {
    const multiNodes = _.size(nodes) > 1
    const multiContext = _.size(context) > 1

    const newContext = _.map(context, (ctx) => {
      if (multiNodes) {
        if (!multiContext) {
          if (_.size(nodes) >= 1) {
            return _.map(nodes, ({ value, path }) =>
              merge(ctx, save, value, [parent(path)]))
          }
          return _.set(ctx, save, null)
        }

        const splitter = _.get(ctx, SPLIT_KEY, [])
        let filters = _.filter(nodes, ({ path }) => {
          let insert = false
          const nodeParent = parent(path)
          _.each(splitter, (split) => {
            if (nodeParent.length === split.length && nodeParent === split) {
              insert = true
            }
          })
          return insert
        })

        if (_.size(filters) === 0) {
          filters = _.filter(nodes, ({ path }) => {
            let insert = false
            const nodeParent = parent(path)
            _.each(splitter, (split) => {
              if (_.startsWith(nodeParent, split)) {
                insert = true
              }
            })
            return insert
          })
        }

        if (_.size(filters) >= 1) {
          return _.map(filters, ({ value, path }) =>
            merge(ctx, save, value, _.union([parent(path)], splitter)))
        }
        return _.set(ctx, save, null)
      }

      const node = _.first(nodes)
      if (node) {
        return _.set(ctx, save, node.value)
      }
      return _.set(ctx, save, null)
    })

    if (multiContext) {
      return _.reduce(newContext, (result, value) => result.concat(value), [])
    }

    return multiNodes ? _.first(newContext) : newContext
  }

  return new Promise((resolve, reject) => {
    Promise.reduce(rules, (context, rule) => {
      const {
        xpath,
        save,
      } = rule

      return updateContext(
        save,
        jp.nodes(raw, xpath),
        context,
      )
    }, [{}])
      .then((results) => {
        const map = _.map(results, item => templater(template, item, (value, data, key) => { // eslint-disable-line
          if (value === '{{$}}') {
            return raw
          }
          if (value === '{{~}}') {
            return _.omit(item, SPLIT_KEY)
          }
          const result = render(value, data)
          return result.startsWith('{{') ? null : result
        }))
        if (flatten && _.size(map) === 1) {
          return resolve(_.first(map))
        }
        return resolve(map)
      }).catch((error) => {
        Logger.error(error)
        reject(error)
      })
  })
}

const version = () =>
  config.get('version')

module.exports = {
  convert,
  version,
}
