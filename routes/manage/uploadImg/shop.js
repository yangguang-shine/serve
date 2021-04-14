// this 指向 ctx
const { getImageName } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')
const { readPipe } = require('../../../tools/readPipe')

module.exports = async function shop() {
    const { name, path: imagePath } = this.request.files.image
    console.log(this.request.files.image)
    console.log(name)
    console.log(imagePath)
    const { shopID } = this.request.body
    const imageName = getImageName(name)
    const imageReader = fs.createReadStream(imagePath)
    const distDir = path.join(__dirname, `../../../public/upload/img/shop/${imageName}`)
    const imageWriter = fs.createWriteStream(distDir)
    const saveImgPromise = readPipe(imageReader, imageWriter)
    const updateImgUrl = `/upload/img/shop/${imageName}`
    let sqlPromise = null
    // let removeFileTemporaryPromise = unlink(`./public/images/temporary/shop/${num}.${ext}`)
    if (shopID) {
        sqlPromise = this.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [updateImgUrl, shopID])
    }
    // await removeFileTemporaryPromise
    await sqlPromise
    await saveImgPromise
    this.body = {
        code: '000',
        msg: '上传成功',
        data: {
            imgUrl: updateImgUrl
        }
    }
}