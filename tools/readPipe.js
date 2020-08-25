exports.readPipe = (readStream, writeStream) => {
    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream).on('error', (e) => {
            reject(e)
        }).on('finish', () => {
            resolve()
        })
    })
}