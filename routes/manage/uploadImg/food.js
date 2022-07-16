const { getImageName, deleteShopImg } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')
const { readPipe } = require('../../../tools/readPipe')

module.exports = async function food() {
    const { name, path: imagePath } = this.request.files.foodImg
    const { foodID } = this.request.body
    const imageName = getImageName(name)
    const imageReader = fs.createReadStream(imagePath)
    const distDir = path.join(__dirname, `../../../public/image/food/${imageName}`)
    const imageWriter = fs.createWriteStream(distDir)
    const saveImgPromise = await readPipe(imageReader, imageWriter)
    let sqlPromise = null
    if (foodID) {
        sqlPromise = this.querySQL(`update shop_food_info set imgUrl = ? where foodID = ?`, [imageName, foodID])
    }
    await sqlPromise
    await saveImgPromise
    this.body = {
        code: '000',
        msg: '上传成功',
        data: {
            imgUrl: imageName
        }
    }
}