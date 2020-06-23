const router = require('koa-router')()
// const multer = require('koa-multer');
const fs = require('fs');
const path = require('path');
// const Multy = require('multy')
// const Images = require('images')
// const host = require('./host');
const randomNum = require('../../tool/randomNum');
const { removeFile } = require('../../tool/fsPromise');
const { getImageExt, deleteShopImg, deleteFoodImg } = require('./imageTool/index')

// router.use(Multy())
router.prefix('/manage/uploadImg/img')

router.post('/shop', async (ctx, next) => {
    try {
        const { name, path: imagePath } = ctx.request.files.image
        const { shopID, imgUrl } = ctx.request.body
        console.log(imgUrl)
        const imageExt = getImageExt(name)
        const imageReader = fs.createReadStream(imagePath)
        const imageNameNum = randomNum(2)
        const distDir = path.join(__dirname, `../../public/upload/img/shop/${imageNameNum}.${imageExt}`)
        const imageWriter = fs.createWriteStream(distDir)
        imageReader.pipe(imageWriter)
        const updateImgUrl = `/upload/img/shop/${imageNameNum}.${imageExt}`
        let removeFilePromise = null
        let sqlPromise = null
        // let removeFileTemporaryPromise = removeFile(`./public/images/temporary/shop/${num}.${ext}`)
        if (shopID) {
            sqlPromise = ctx.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [updateImgUrl, shopID])
        }
        if (imgUrl) {
            // removeFilePromise = removeFile(`./public/upload/img/shop/${imgUrl}`)
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

// 上传图片
// router.post('/shop/uploadImg', async (ctx, next) => {
//     try {
//         const num = randomNum(2)
//         const ext = ctx.request.body.image.mimetype.split('/')[1]
//         const { image, shopID, imgUrl } = ctx.request.body
//         if (!image) {
//             ctx.body = ctx.parameterError
//             return
//         }
//         const stream = fs.createWriteStream(`./public/images/temporary/shop/${num}.${ext}`)
//         const WritePromise = WriteImg(stream, image)
//         await WritePromise
//         Images(`./public/images/temporary/shop/${num}.${ext}`).size(200).save(`./public/images/upload/shop/${num}.${ext}`)
//         let removeFilePromise = null
//         let sqlPromise = null
//         let removeFileTemporaryPromise = removeFile(`./public/images/temporary/shop/${num}.${ext}`)
//         if (shopID) {
//             sqlPromise = ctx.querySQL(`update shop_list set imgUrl = ? where shopID = ?`, [`/images/upload/shop/${num}.${ext}`, shopID])
//         }
//         if (imgUrl) {
//             removeFilePromise = removeFile(`./public/images/upload/shop/${imgUrl}`)
//         }
//         await removeFileTemporaryPromise
//         await removeFilePromise
//         await sqlPromise
//         ctx.body = {
//             code: '000',
//             msg: '上传成功',
//             data: {
//                 imgUrl: `/images/upload/shop/${num}.${ext}`
//             }
//         }
//     } catch (e) {
//         console.log(e)
//         ctx.body = {
//             code: '111',
//             msg: '上传失败',
//             data: null
//         }
//     }
// })

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
        console.log(imgUrl)
        const imageExt = getImageExt(name)
        const imageReader = fs.createReadStream(imagePath)
        const imageNameNum = randomNum(2)
        const distDir = path.join(__dirname, `../../public/upload/img/food/${imageNameNum}.${imageExt}`)
        const imageWriter = fs.createWriteStream(distDir)
        imageReader.pipe(imageWriter)
        const updateImgUrl = `/upload/img/food/${imageNameNum}.${imageExt}`
        let removeFilePromise = null
        let sqlPromise = null
        // let removeFileTemporaryPromise = removeFile(`./public/images/temporary/food/${num}.${ext}`)
        if (foodID) {
            sqlPromise = ctx.querySQL(`update food_info_${shopID} set imgUrl = ? where foodID = ?`, [updateImgUrl, foodID])
        }
        if (imgUrl) {
            // removeFilePromise = removeFile(`./public/upload/img/food/${imgUrl}`)
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
            await removeFile(`./public${imgUrl}`)
        }
        if (deleteFood) {
            await removeFile(`./public${imgUrl}`)
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