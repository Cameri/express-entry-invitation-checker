const Promise = require('bluebird')
const {logger, emoji} = require('./util')
const db = require('./db/knex')
const DrawsDao = require('./db/dao/draws-dao')
const DrawChatsDao = require('./db/dao/draw-chats-dao')
const {getCurrentDraw} = require('./express-entry-rounds-service')
const {sendMessage} = require('./telegram-service')

function prepareMessage (data) {
  logger.debug('prepareMessage() data:', data)
  const date = data.draw_date.format('MMMM DD YYYY')

  return `${emoji.EMOJI_HORN} New Express Entry Draw for <b>${date}</b>
  ${emoji.EMOJI_STAR} Lowest CRS Score: <code>${data.lowest_crs}</code>
  ${emoji.EMOJI_INCOMING_ENVELOPE} <code>${data.invitations_issued}</code> invitations issued
  @canadaimmigrationnews`
}

function sendUpdates (text) {
  logger.debug('sendUpdates() text:', text)

  function doSendUpdates (chats) {
    logger.debug('doSendUpdates() chats:', chats.length, ' left')
    if (chats.length === 0) {
      return Promise.resolve()
    }
    const chat = chats.shift()

    return sendMessage(chat.chat_id, text)
      .then(() => doSendUpdates(chats))
  }

  return DrawChatsDao.getAll(db)
    .then(doSendUpdates)
}

function getLatestRecordedDraw () {
  logger.debug('getLatestRecordedDraw()')
  return DrawsDao.getLatestRecordedDraw(db)
}

function dispose () {
  logger.debug('dispose()')
  db.destroy()
}

function run () {
  logger.debug('run()')
  return Promise.all([
    getLatestRecordedDraw(),
    getCurrentDraw()
  ])
  .then(([previous, current]) => {
    logger.debug('run() previous:', previous, 'current:', current)
    if (previous.draw_date.isBefore(current.draw_date)) {
      return DrawsDao.save(db, current)
       .then(() => prepareMessage(current))
       .then(sendUpdates)
    }
  })
  .finally(dispose)
}

if (require.main === module) {
  run()
}
