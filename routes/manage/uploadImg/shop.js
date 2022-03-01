// this 指向 ctx
const { getImageName } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')
const { readPipe } = require('../../../tools/readPipe')

module.exports = async function shop() {
    const { name, path: imagePath } = this.request.files.shopImg
    console.log(this.request.files.image)
    console.log(name)
    console.log(imagePath)
    const { shopID } = this.request.body
    const imageName = getImageName(name)
    const imageReader = fs.createReadStream(imagePath)
    const distDir = path.join(__dirname, `../../../public/upload/img/shop/${imageName}`)
    const imageWriter = fs.createWriteStream(distDir)
    const saveImgPromise = readPipe(imageReader, imageWriter)
    let sqlPromise = null
    if (shopID) {
        sqlPromise = this.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [imageName, shopID])
    }
    await sqlPromise
    await saveImgPromise
    this.body = {
        code: '000',
        msg: '上传并更新店铺图片成功',
        data: {
            imgUrl: imageName
        }
    }
}