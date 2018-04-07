
let instance
const knex = require('knex')
const {database} = require('../../config/config')
function get () {
  if (instance) {
    return instance
  }
  instance = knex({
    client: 'mariasql',
    connection: {...database}
  })
  return instance
}

module.exports = get()
