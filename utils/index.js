// const { unlink } = require('../tools/fsPromise')
const { unlink } = require('fs').promises;

exports.deleteShopImg = async (path) => {
    try {
        await unlink(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}

exports.deleteFoodImg = async (path) => {
    try {
        await unlink(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}