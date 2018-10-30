'use strict'
const axios = require('axios')
const config = require('../config/config')
const {logger} = require('./util')
function sendMessage (chatId, text) {
  const url = `https://api.telegram.org/bot${config.telegram_api_key}/sendMessage`
  logger.debug('sendMessage() chatId:', chatId, 'text:', text)

  return axios.get(url, {
    params: {
      text,
      chat_id: chatId,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }
  })
}

const API = {
  sendMessage
}

module.exports = API
