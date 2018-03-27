
let instance
const knex = require('knex')

function get () {
  if (instance) {
    return instance
  }
  instance = knex({
    client: 'mariasql',
    connection: Object.assign({}, require('../../config/config').database)
  })
  return instance
}

module.exports = get()
