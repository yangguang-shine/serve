const { removeFile } = require('../tool/fsPromise')
exports.deleteShopImg = async (path) => {
    try {
        await removeFile(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}

exports.deleteFoodImg = async (path) => {
    try {
        await removeFile(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}