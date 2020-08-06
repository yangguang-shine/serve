const { getImageName, deleteShopImg } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')

module.exports = async function edit() {
    const { name, path: imagePath } = this.request.files.image
        const { shopID, imgUrl, foodID } = this.request.body
        const imageName = getImageName(name)
        const imageReader = fs.createReadStream(imagePath)
        const distDir = path.join(__dirname, `../../public/upload/img/food/${imageName}`)
        const imageWriter = fs.createWriteStream(distDir)
        imageReader.pipe(imageWriter)
        const updateImgUrl = `/upload/img/food/${imageName}`
        let removeFilePromise = null
        let sqlPromise = null
        // let removeFileTemporaryPromise = unlink(`./public/images/temporary/food/${num}.${ext}`)
        if (foodID) {
            sqlPromise = this.querySQL(`update food_info_${shopID} set imgUrl = ? where foodID = ?`, [updateImgUrl, foodID])
        }
        if (imgUrl) {
            // removeFilePromise = unlink(`./public/upload/img/food/${imgUrl}`)
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