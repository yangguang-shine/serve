// const { unlink } = require('../../../tools/fsPromise')
// const fs = require('fs').promises;
// const unlink = fs.unlink
const { unlink } = require('fs').promises

const randomNum = require('../../../tools/randomNum');

const getImageName = (name = '') => {
    const imageNameNum = randomNum(2)
    const splitList = name.split('.')
    let ext = ''
    if (splitList.length) {
        ext = splitList[splitList.length - 1]
        return `${imageNameNum}.${ext}`
    } else {
        throw '无后缀'
    }
}
const deleteShopImg = async (path) => {
    try {
        await unlink(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}

const deleteFoodImg = async (path) => {
    try {
        await unlink(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}
module.exports = {
    getImageName,
    deleteShopImg,
    deleteFoodImg
}