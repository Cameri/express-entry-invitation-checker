function getAll (db) {
  return db.select(['chat_id', 'comment']).from('express_entry_draw_chats').where('deleted', false)
}

const API = {
  getAll
}

module.exports = API
