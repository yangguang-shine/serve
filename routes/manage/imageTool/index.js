const { removeFile } = require('../../../tool/fsPromise')
const randomNum = require('../../../tool/randomNum');

const getImageName = (name = '') => {
    const imageNameNum = randomNum(2)
    const splitList = name.split('.')
    let ext = ''
    if (splitList.length) {
        ext = splitList[splitList.length -1]
        return `${imageNameNum}.${ext}`
    } else {
        throw '无后缀'
    }
    return 
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
    getImageName,
    deleteShopImg,
    deleteFoodImg
}