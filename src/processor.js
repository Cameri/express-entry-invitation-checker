'use strict'
const Promise = require('bluebird')
const readFileAsync = Promise.promisify(require('fs').readFile)
const Handlebars = require('handlebars')
const db = require('./db/knex')
const {logger, emoji} = require('./util')
const {DrawsDao, DrawChatsDao} = require('./db/dao')
const {getCurrentDraw} = require('./express-entry-rounds-service')
const {sendMessage} = require('./telegram-service')
const {getGist} = require('./gist-service')

function prepareMessageText (data) {
  logger.debug('prepareMessage() data: %s', JSON.stringify(data))
  const context = {
    ...data,
    date: data.draw_date.format('MMMM DD YYYY'),
    emoji: emoji
  }
  logger.debug('prepareMessage() context: %s', JSON.stringify(data))

  return getGist()
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
    .then(Handlebars.compile)
    .then(template => template(context))
}

function sendUpdates (data) {
  logger.debug('sendUpdates() data: %s', JSON.stringify(data))

  return Promise.all([
    prepareMessageText(data),
    DrawChatsDao.getAll(db)
  ])
    .then(([text, chats]) => {
      // chats: [{chat_id: ..., comment: ...}, {chat_id: ..., comment: ...}, ...]
      logger.debug('sendUpdates() chats: %s. text: %s', chats.map(chat => `${chat.comment} (${chat.chat_id})`).join(', '), text)

      return chats.reduce((chain, {chat_id: chatId}) => {
        return chain.then(() => sendMessage(chatId, text))
          .catch(err => {
            if (err.response) {
              logger.error('sendUpdates() Axios response error: %s. err.config: %s, err.stack: %s', err, JSON.stringify(err.config), err.stack)
            } else if (err.request) {
              logger.error('sendUpdates() Axios request error: %s. err.config: %s, err.stack: %s', err, JSON.stringify(err.config), err.stack)
            } else {
              logger.error('sendUpdates() unexpected error: %s. err.stack: %s', err, err.stack)
            }
          })
      }, Promise.resolve())
    })
}

function getLatestRecordedDraw () {
  logger.debug('getLatestRecordedDraw()')
  return DrawsDao.getLatestRecordedDraw(db)
}

function run () {
  logger.debug('run()')

  // Get latest recorded draw from database and current draw from CIC
  return Promise.all([
    getLatestRecordedDraw(),
    getCurrentDraw()
  ])
    .then(([previous, current]) => {
      // Compare recorded draw's modified date and current draw's modified date
      logger.debug('run() previous: %s. current: %s', JSON.stringify(previous), JSON.stringify(current))
      if (previous.draw_date.isBefore(current.draw_date)) {
        // Save new draw
        return DrawsDao.save(db, current)
          .then(() => sendUpdates(current))
      }
    })
    .finally(() => {
      // Close db connection(s)
      if (db) {
        db.destroy()
      }
    })
}

const API = {
  run
}

module.exports = API
