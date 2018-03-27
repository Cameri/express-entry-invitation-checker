const {Logger, transports} = require('winston')

const logger = createLogger()

function createLogger () {
  return new Logger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
      new (transports.Console)({
        handleExceptions: true,
        colorize: true
      })
    ]
  })
}

module.exports = logger
