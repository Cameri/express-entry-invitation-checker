const moment = require('moment')

const DATE_FMT = 'YYYY-MM-DD HH:mm:ss'

function save (db, draw) {
  const newDraw = Object.keys(draw)
    .filter(key => draw[key] instanceof moment)
    .reduce((prev, key) => {
      prev[key] = prev[key].format(DATE_FMT)
      return prev
    }, {...draw})
  return db('express_entry_draws').insert(newDraw)
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
      return {
        ...result,
        ...{
          draw_date: moment.utc(result.draw_date),
          date_modified: moment.utc(result.date_modified),
          tie_break: moment.utc(result.tie_break)
        }
      }
    })
}

const API = {
  save,
  getLatestRecordedDraw
}

module.exports = API
