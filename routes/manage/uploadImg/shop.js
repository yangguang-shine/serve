// this 指向 ctx
const { getImageName, deleteShopImg } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')

module.exports = async function shop() {
    const { name, path: imagePath } = this.request.files.image
    console.log(this.request)
    const { shopID, imgUrl } = this.request.body
    const imageName = getImageName(name)
    const imageReader = fs.createReadStream(imagePath)
    const distDir = path.join(__dirname, `../../public/upload/img/shop/${imageName}`)
    const imageWriter = fs.createWriteStream(distDir)
    imageReader.pipe(imageWriter)
    const updateImgUrl = `/upload/img/shop/${imageName}`
    let removeFilePromise = null
    let sqlPromise = null
    // let removeFileTemporaryPromise = unlink(`./public/images/temporary/shop/${num}.${ext}`)
    if (shopID) {
        sqlPromise = this.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [updateImgUrl, shopID])
    }
    if (imgUrl) {
        // removeFilePromise = unlink(`./public/upload/img/shop/${imgUrl}`)
        removeFilePromise = deleteShopImg(`./public${imgUrl}`)
    }
    // await removeFileTemporaryPromise
    await removeFilePromise
    await sqlPromise
    this.body = {
        code: '000',
        msg: '上传成功',
        data: {
            imgUrl: updateImgUrl
        }
    }
}