const fs = require('fs')
exports.unlink = (path) => {
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
exports.writeFile = (path, dataBuffer) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, dataBuffer, function(err) {
            if(err) {
                reject(err);
            }else {
                resolve('写入成功！');
            }
        })
    })
}
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