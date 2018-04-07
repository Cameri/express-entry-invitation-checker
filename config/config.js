'use strict'
module.exports = {
  telegram_api_key: process.env.TELEGRAM_API_KEY || 'missing',
  telegram_message_text_url: process.env.TELEGRAM_MESSAGE_TEXT_URL || 'https://gist.github.com/Cameri/2760dcd0c32fa17248c2049b17a0b300/raw',
  express_entry_rounds_url: process.env.EXPRESS_ENTRY_ROUNDS_URL || 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/become-candidate/rounds-invitations.html',
  database: {
    'host': process.env.DB_HOST || '127.0.0.1',
    'user': process.env.DB_USER || 'missing',
    'password': process.env.DB_PASSWORD || 'missing',
    'db': process.env.DB_NAME || 'missing'
  }
}
