// this 指向 ctx
const { getImageName } = require('../_manageCommonTool')

const fs = require('fs')
const path = require('path')
const { readPipe } = require('../../../tools/readPipe')

module.exports = async function common() {
    const { name, path: imagePath } = this.request.files.file
    const imageName = getImageName(name)
    const imageReader = fs.createReadStream(imagePath)
    const distDir = path.join(__dirname, `../../../public/image/default/${imageName}`)
    const imageWriter = fs.createWriteStream(distDir)
    const saveImgPromise = readPipe(imageReader, imageWriter)
    await saveImgPromise
    this.body = {
        code: '000',
        msg: '上传并更新店铺图片成功',
        data: {
            imgUrl: imageName
        }
    }
}