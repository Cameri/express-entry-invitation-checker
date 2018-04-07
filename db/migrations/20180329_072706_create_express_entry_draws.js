exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists('express_entry_draws', (table) => {
    table.increments('id').primary()
    table.datetime('draw_date').notNullable()
    table.integer('lowest_crs').notNullable()
    table.integer('invitations_issued').nullable()
    table.datetime('tie_break').nullable()
    table.date('date_modified').notNullable()
    table.string('hash').notNullable()
    table.timestamps(true, true)

    table.index('date_modified')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('express_entry_draws')
}
