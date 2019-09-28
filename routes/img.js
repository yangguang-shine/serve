const router = require('koa-router')()
// const multer = require('koa-multer');
const fs = require('fs');
const Multy = require('multy')
const Images = require('images')
// const host = require('./host');
const randomNum = require('../tool/randomNum');
const { unlink } = require('../tool/fsPromise');

router.use(Multy())
router.prefix('/api/img')
// 上传图片
router.post('/shop/uploadImg', async (ctx, next) => {
    try {
    // console.log(ctx.request.body)
        const num = randomNum(2)
        const ext = ctx.request.body.image.mimetype.split('/')[1]
        const { image, shopID, imgUrl } = ctx.request.body
        if (!image) {
            ctx.body = ctx.parameterError
            return
        }
        const stream = fs.createWriteStream(`./public/images/temporary/shop/${num}.${ext}`)
        const WritePromise = WriteImg(stream, image)
        await WritePromise
        Images(`./public/images/temporary/shop/${num}.${ext}`).size(200).save(`./public/images/upload/shop/${num}.${ext}`)
        let unlinkPromise = null
        let sqlPromise = null
        let unlinkTemporaryPromise = unlink(`./public/images/temporary/shop/${num}.${ext}`)
        if (shopID) {
            sqlPromise = ctx.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [`/images/upload/shop/${num}.${ext}`, shopID])
        }
        if (imgUrl) {
            unlinkPromise = unlink(`./public/images/upload/shop/${imgUrl}`)
        }
        await unlinkTemporaryPromise
        await unlinkPromise
        await sqlPromise
        ctx.body = {
            code: '000',
            msg: '上传成功',
            data: {
                imgUrl: `/images/upload/shop/${num}.${ext}`
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

router.post('/food/uploadImg', async (ctx, next) => {
    try {
        // console.log(ctx.request.body)
        const num = randomNum(2)
        console.log(ctx.request.body)
        console.log(11111111)
        console.log(ctx.request.body.foodID)
        const { image, foodID, imgUrl, shopID } = ctx.request.body
        if (!(image && shopID)) {
            ctx.body = ctx.parameterError
            return
        }
        const ext = image.mimetype.split('/')[1]
        const stream = fs.createWriteStream(`./public/images/temporary/food/${num}.${ext}`)
        const WritePromise = WriteImg(stream, image)
        await WritePromise
        Images(`./public/images/temporary/food/${num}.${ext}`).size(200).save(`./public/images/upload/food/${num}.${ext}`)
        let unlinkTemporaryPromise = unlink(`./public/images/temporary/food/${num}.${ext}`)
        let unlinkPromise = null
        let sqlPromise = null
        if (foodID) {
            sqlPromise = ctx.querySQL(`update food_info_${shopID} set imgUrl = ? where foodID = ?`, [`/images/upload/food/${num}.${ext}`, foodID])
        }
        if (imgUrl) {
            unlinkPromise = unlink(`./public/images/upload/food/${imgUrl}`)
        }
        await unlinkTemporaryPromise
        await unlinkPromise
        await sqlPromise
        ctx.body = {
            code: '000',
            msg: '上传成功',
            data: {
                imgUrl: `/images/upload/food/${num}.${ext}`
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
        const reg = /.+\/(\d+\.)/
        const deleteImgUrl = imgUrl.replace(reg, '$1')
        if (deleteShop) {
            await unlink(`./public/images/upload/shop/${deleteImgUrl}`)
        }
        if (deleteFood) {
            await unlink(`./public/images/upload/food/${deleteImgUrl}`)
        }
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: {}
        }
    } catch(e) {
        console.log(e)
        ctx.body = {
            code: '000',
            msg: '删除失败',
            data: {}
        }
    }
})
module.exports = router