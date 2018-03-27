const crypto = require('crypto')
const sha256 = crypto.createHash('sha256')

const API = {
  digest: (data) => sha256.update(data).digest('hex')
}

module.exports = API
