exports.readPipe = (readStream, writeStream, finish, error) => {
    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream).on('finish', () => {
            resolve()
        }).on('error', () => {
            reject()
        })
    })
}