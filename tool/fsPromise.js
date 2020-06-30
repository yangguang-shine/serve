const fs = require('fs')

// 删除文件
exports.removeFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, function(err) {
            if(err) {
                reject(err);
            }else {
                resolve('创建成功！');
            }
        })
    })
}

// 删除文件加
exports.rmdir = (path) => {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, function(err) {
            if(err) {
                reject(err);
            }else {
                resolve('创建成功！');
            }
        })
    })
}
// 创建文件夹
exports.mkdir = (path) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, function(err) {
            if(err) {
                reject(err);
            }else {
                resolve('创建成功！');
            }
        })
    })
}

// 写文件
exports.writeFile = (path, dataBuffer, options) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, dataBuffer, options, function(err) {
            if(err) {
                reject(err);
            }else {
                resolve('写入成功！');
            }
        })
    })
}

// 读文件
exports.readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, function(err, data) {
            if(err) {
                reject(err);
            }else {
                resolve(data.toString());
            }
        })
    })
}

// 判断存在
exports.access = (path) => {
    return new Promise((resolve, reject) => {
        fs.access(path, function(err) {
            if(err) {
               resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}
exports.readPipe = (readStream, writeStream, finish, error) => {
    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream).on('finish', () => {
            resolve()
        }).on('error', () => {
            reject()
        })
    })
    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream).on('finish', () => {
            resolve()
        }).on('error', () => {
            reject()
        })
    })
}