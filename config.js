const _ = require('lodash')
const Confidence = require('confidence')
const ToBoolean = require('to-boolean')

const pack = require('./package')

const config = {
  $meta: 'This file defines all configuration for project.',
  description: pack.description,
  logger: {
    options: {
      console: ToBoolean(_.defaultTo(process.env.LOGGER_DEBUG, true)),
    },
  },
  name: pack.name,
  version: pack.version,
}

const store = new Confidence.Store(config)
const criteria = {
  env: process.env.APP_ENV,
}

module.exports = {
  get: key => store.get(key, criteria),
  meta: key => store.meta(key, criteria),
}
