const { removeFile } = require('../../../tool/fsPromise')

const getImageExt = (name = '') => {
    const splitList = name.split('.')
    if (splitList.length) {
        return splitList[splitList.length -1]
    } else {
        throw '无后缀'
    }
}
const deleteShopImg = async (path) => {
    try {
        await removeFile(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}

const deleteFoodImg = async (path) => {
    try {
        await removeFile(path)
    } catch (e) {
        console.log(`${path}  删除失败`)
    }
}
module.exports = {
    getImageExt,
    deleteShopImg,
    deleteFoodImg
}