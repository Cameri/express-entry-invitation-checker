'use strict'
const axios = require('axios')
const config = require('../config/config')
const {logger} = require('./util')

function getGist () {
  const url = config.telegram_message_text_url
  logger.debug('getGist() url: %s', url)

  return axios.get(url, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  })
}

const API = {
  getGist
}

module.exports = API
