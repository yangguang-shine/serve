exports.readPipe = (readStream, writeStream) => {

    return new Promise((resolve, reject) => {
        readStream.on('error', () => {
            console.log('read stream error')
            reject('read stream error')
        })
        writeStream.on('error', () => {
            console.log('write stream error')
            reject('write stream error')
        })
        readStream.pipe(writeStream).on('finish', () => {
            resolve()
        })
    })
}