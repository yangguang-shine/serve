const { getImageName, deleteShopImg } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')
const { readPipe } = require('../../../tools/readPipe')

module.exports = async function food() {
    console.log('this.request.files')
    console.log(this.request.files)
    const { name, path: imagePath } = this.request.files.shopImg
    console.log(this.request.files.image)
    const { foodID } = this.request.body
    const imageName = getImageName(name)
    const imageReader = fs.createReadStream(imagePath)
    // debugger
    const distDir = path.join(__dirname, `../../../public/upload/img/food/${imageName}`)
    const imageWriter = fs.createWriteStream(distDir)
    const saveImgPromise = await readPipe(imageReader, imageWriter)
    const updateImgUrl = `/upload/img/food/${imageName}`
    let sqlPromise = null
    // let removeFileTemporaryPromise = unlink(`./public/images/temporary/food/${num}.${ext}`)
    if (foodID) {
        sqlPromise = this.querySQL(`update shop_food_info set imgUrl = ? where foodID = ?`, [updateImgUrl, foodID])
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