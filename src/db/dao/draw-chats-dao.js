function getAll (db) {
  return db.select(['chat_id']).from('express_entry_draw_chats')
}

const API = {
  getAll
}

module.exports = API
