exports.up = function (knex, Promise) {
  return knex.schema.table('express_entry_draw_chats', function (table) {
    table.boolean('deleted').defaultTo(false)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('express_entry_draw_chats', function (table) {
    table.dropColumn('deleted')
  })
}
