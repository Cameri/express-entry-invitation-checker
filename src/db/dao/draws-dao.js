const moment = require('moment')

function save (db, draw) {
  return db('express_entry_draws').insert(draw)
}

function getLatestRecordedDraw (db) {
  return db.select([
    'draws.draw_date',
    'draws.lowest_crs',
    'draws.invitations_issued',
    'draws.tie_break',
    'draws.date_modified',
    'draws.hash'
  ])
    .from('express_entry_draws as draws')
    .orderBy('draws.date_modified', 'DESC')
    .limit(1)
    .then(([result]) => {
      return Object.assign({}, result, {
        draw_date: moment.utc(result.draw_date),
        date_modified: moment.utc(result.date_modified),
        tie_break: moment.utc(result.tie_break)
      })
    })
}

const API = {
  save,
  getLatestRecordedDraw
}

module.exports = API
