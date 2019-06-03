module.exports = (res) => {
    return new Promise((resolve, reject) => {
        let data = '';
        res.setEncoding('utf8')
        res.on('error', () => {
            reject(new Error('error'))
        })
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            resolve(data)
        })
    })
}