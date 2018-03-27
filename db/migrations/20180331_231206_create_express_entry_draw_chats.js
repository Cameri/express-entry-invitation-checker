
exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists('express_entry_draw_chats', (table) => {
    table.increments('id').primary()
    table.integer('chat_id').notNullable()
    table.string('comment').notNullable()

    table.index('chat_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('express_entry_draw_chats')
}
