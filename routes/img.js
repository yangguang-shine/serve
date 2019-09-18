const router = require('koa-router')()
// const multer = require('koa-multer');
const fs = require('fs');
const Multy = require('multy')
// const host = require('./host');
const randomNum = require('../tool/randomNum');
const { writeFile, unlink, access } = require('../tool/fsPromise');

router.use(Multy())
router.prefix('/api/img')
// 上传图片
router.post('/shop/uploadImg', async (ctx, next) => {
    try {
    // console.log(ctx.request.body)
        const num = randomNum(2)
        const ext = ctx.request.body.image.mimetype.split('/')[1]
        const { image, shopID, imgUrl } = ctx.request.body
        const stream = fs.createWriteStream(`./public/images/upload/shop/${num}.${ext}`)
        const WritePromise = WriteImg(stream, image)
        let unlinkPromise = null
        let sqlPromise = null
    if (shopID) {
        sqlPromise = ctx.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [`/images/upload/shop/${num}.${ext}`, shopID])
    }
    if (imgUrl) {
        unlinkPromise = unlink(`./public/images/upload/shop/${imgUrl}`)
    }
    await WritePromise
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

// router.post('/shop/uploadImg', async (ctx, next) => {
//     try {
//         const { imgData, ext, imgUrl, shopID } = ctx.request.body
//         const num = randomNum(2)
//         const path = `./public/images/upload/shop/${num}.${ext}`;// 从app.js级开始找--在我的项目工程里是这样的
//         const base64 = imgData.replace(/^data:image\/\w+;base64,/, "");// 去掉图片base64码前面部分data:image/png;base64
//         const dataBuffer = Buffer.from(base64, 'base64'); // 把base64码转成buffer对象，
//         const writePromise = writeFile(path, dataBuffer)
//         let unlinkPromise = null
//         let sqlPromise = null
//         if (shopID) {
//             sqlPromise = ctx.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [`/images/upload/shop/${num}.${ext}`, shopID])
//         }
//         if (imgUrl) {
//             unlinkPromise = unlink(`./public/images/upload/shop/${imgUrl}`)
//         }
//         await writePromise
//         await sqlPromise
//         await unlinkPromise
//         ctx.body = {
//             code: '000',
//             msg: '上传成功',
//             data: {
//                 imgUrl: `/images/upload/shop/${num}.${ext}`
//             }
//         }
//     } catch(e) {
//         console.log(e)
//         ctx.body = {
//             code: '111',
//             msg: '上传失败',
//             data: null
//         }
//     }
// })
router.post('/food/uploadImg', async (ctx, next) => {
    try {
        // console.log(ctx.request.body)
            const num = randomNum(2)
            console.log(ctx.request.body)
            console.log(11111111)
            console.log(ctx.request.body.foodID)
            const { image, foodID, imgUrl, shopID } = ctx.request.body
            const ext = image.mimetype.split('/')[1]
            const stream = fs.createWriteStream(`./public/images/upload/food/${num}.${ext}`)
            const WritePromise = WriteImg(stream, image)
            let unlinkPromise = null
            let sqlPromise = null
        if (foodID) {
            sqlPromise = ctx.querySQL(`update food_info_${shopID} set imgUrl = ? where foodID = ?`, [`/images/upload/food/${num}.${ext}`, foodID])
        }
        if (imgUrl) {
            unlinkPromise = unlink(`./public/images/upload/food/${imgUrl}`)
        }
        await WritePromise
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
    // try {
    //     const { imgData, ext, imgUrl, shopID, foodID } = ctx.request.body
    //     const num = randomNum(2)
    //     const path = `./public/images/upload/food/${num}.${ext}`;// 从app.js级开始找--在我的项目工程里是这样的
    //     const base64 = imgData.replace(/^data:image\/\w+;base64,/, "");// 去掉图片base64码前面部分data:image/png;base64
    //     const dataBuffer = Buffer.from(base64, 'base64'); // 把base64码转成buffer对象，
    //     const writePromise = writeFile(path, dataBuffer)
    //     let unlinkPromise = null
    //     let sqlPromise = null
    //     if (foodID) {
    //         sqlPromise = ctx.querySQL(`update food_info_${shopID} set imgUrl = ? where foodID = ?`, [`/images/upload/food/${num}.${ext}`, foodID])
    //     }
    //     if (imgUrl) {
    //         unlinkPromise = unlink(`./public/images/upload/food/${imgUrl}`)
    //     }
    //     await writePromise
    //     await sqlPromise
    //     await unlinkPromise
    //     ctx.body = {
    //         code: '000',
    //         msg: '上传成功',
    //         data: {
    //             imgUrl: `/images/upload/food/${num}.${ext}`
    //         }
    //     }
    // } catch(e) {
    //     console.log(e)
    //     ctx.body = {
    //         code: '111',
    //         msg: '上传失败',
    //         data: null
    //     }
    // }
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