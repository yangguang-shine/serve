const router = require('koa-router')()
// const multer = require('koa-multer');
const fs = require('fs');
const path = require('path');
// const Multy = require('multy')
// const Images = require('images')
// const host = require('./host');
const randomNum = require('../../tools/randomNum');
// const { unlink } = require('../../tools/fsPromise');
const { unlink } = require('fs').promises;

const { getImageName, deleteShopImg, deleteFoodImg } = require('./imageTool/index')

// router.use(Multy())
router.prefix('/api/manage/uploadImg')

router.post('/shop', async (ctx, next) => {
    try {
        const { name, path: imagePath } = ctx.request.files.image
        console.log(ctx.request)
        const { shopID, imgUrl } = ctx.request.body
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
            sqlPromise = ctx.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [updateImgUrl, shopID])
        }
        if (imgUrl) {
            // removeFilePromise = unlink(`./public/upload/img/shop/${imgUrl}`)
            removeFilePromise = deleteShopImg(`./public${imgUrl}`)
        }
        // await removeFileTemporaryPromise
        await removeFilePromise
        await sqlPromise
        ctx.body = {
            code: '000',
            msg: '上传成功',
            data: {
                imgUrl: updateImgUrl
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '上传失败',
            data: null
        }
    }
})

function WriteImg(stream, image) {
    return new Promise((resolve, reject) => {
        image
            .pipe(stream)
            .on('close', () => resolve())
            .on('error', reject)
    })
}

router.post('/food', async (ctx, next) => {
    try {
        const { name, path: imagePath } = ctx.request.files.image
        const { shopID, imgUrl, foodID } = ctx.request.body
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
            sqlPromise = ctx.querySQL(`update food_info_${shopID} set imgUrl = ? where foodID = ?`, [updateImgUrl, foodID])
        }
        if (imgUrl) {
            // removeFilePromise = unlink(`./public/upload/img/food/${imgUrl}`)
            removeFilePromise = deleteShopImg(`./public${imgUrl}`)
        }
        // await removeFileTemporaryPromise
        await removeFilePromise
        await sqlPromise
        ctx.body = {
            code: '000',
            msg: '上传成功',
            data: {
                imgUrl: updateImgUrl
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '上传失败',
            data: null
        }
    }
})
router.post('/delete', async (ctx, next) => {
    try {
        const { deleteShop = false, deleteFood = false, imgUrl } = ctx.request.body
        if (deleteShop) {
            await unlink(`./public${imgUrl}`)
        }
        if (deleteFood) {
            await unlink(`./public${imgUrl}`)
        }
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: {}
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '000',
            msg: '删除失败',
            data: {}
        }
    }
})
module.exports = router