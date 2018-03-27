const moment = require('moment')
const axios = require('axios')
const cheerio = require('cheerio')
const {hash: {digest}, logger} = require('./util')
const config = require('../config/config')

function getCurrentDraw () {
  logger.debug('getCurrentDraw()')
  return axios.get(config.express_entry_rounds_url)
    .then(parsePage)
    .then(extractData)
}

function parsePage (response) {
  logger.debug('parsePage() response:', response.length, ' bytes')
  const $ = cheerio.load(response.data)
  return {
    'draw_date': $('strong:contains(time of round)').parent().contents().text(),
    'lowest_crs': $('strong:contains(lowest-ranked candidate)').parent().contents().text(),
    'invitations_issued': $('strong:contains(Rank required)').parent().contents().text(),
    'tie_break': $('strong:contains(breaking rule)').parent().contents().text(),
    'date_modified': $('dt:contains(Date modified)').parent().contents().text(),
    'hash': digest(response.data)
  }
}

function extractData (data) {
  logger.debug('extractData() data:', data)
  const drawDateStr = data.draw_date.split(': ').pop()
  const drawDate = moment.utc(drawDateStr, 'MMMM-DD-YYYY-HH:mm:ss')
  const lowestCrs = parseInt(data.lowest_crs.split(': ').pop().replace(',', '').trim(), 10)
  const invitationsIssued = parseInt(data.invitations_issued.match(/[0-9,]+/)[0].replace(',', ''), 10)
  const tieBreakStr = data.tie_break.match(/:\s*(.+?)\s*UTC/)[1]
  const tieBreak = moment.utc(tieBreakStr, 'MMMM-DD-YYYY-HH:mm:ss')
  const dateModified = moment.utc(data.date_modified.match(/\d{4}-\d{2}-\d{2}/)[0])
  return {
    draw_date: drawDate,
    lowest_crs: lowestCrs,
    invitations_issued: invitationsIssued,
    tie_break: tieBreak,
    date_modified: dateModified,
    hash: data.hash
  }
}

const API = {
  getCurrentDraw
}

module.exports = API