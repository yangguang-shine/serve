exports.readPipe = (readStream, writeStream) => {
    readStream.on('error', () => {
        console.log('read stream error')
        reject('read stream error')
    })
    writeStream.on('error', () => {
        console.log('write stream error')
        reject('write stream error')
    })
    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream).on('finish', () => {
            resolve()
        })
    })
}