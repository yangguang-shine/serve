module.exports = (res, encode = 'utf-8') => {
    return new Promise((resolve, reject) => {
        let data = '';
        res.setEncoding(encode)
        res.on('error', (err) => {
            reject(err)
        })
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            resolve(data)
        })
    })
}