const http = require('http')
module.exports = (url = '') => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            if (res) resolve(res)
            else reject(res)
        })
    })
}