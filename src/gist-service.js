'use strict'
const axios = require('axios')
const config = require('../config/config')
const {logger} = require('./util')
const Promise = require('bluebird')
const readFileAsync = Promise.promisify(require('fs').readFile)

function getGist () {
  const url = config.telegram_message_text_url
  logger.debug('getGist() url: %s', url)

  return axios.get(url, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  })
    .then(response => response.data)
    .catch(err => {
      if (err.response) {
        logger.error('prepareMessageText() Axios response error: %s. err.config: %s, err.stack: %s', err, JSON.stringify(err.config), err.stack)
      } else if (err.request) {
        logger.error('prepareMessageText() Axios request error: %s. err.config: %s, err.stack: %s', err, JSON.stringify(err.config), err.stack)
      } else {
        logger.error('prepareMessageText() unexpected error: %s. err.stack: %s', err, err.stack)
      }
      return readFileAsync('./templates/telegram-message-text.html', 'utf8')
    })
}

const API = {
  getGist
}

module.exports = API
