module.exports = (res, encode = 'utf-8') => {
    return new Promise((resolve, reject) => {
        let data = '';
            res.setEncoding(encode)
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