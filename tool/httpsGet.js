const https = require('https')
module.exports = (url = '') => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res) resolve(res)
            else reject(res)
        })
    })
}