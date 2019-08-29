const router = require('koa-router')()
const multer = require('koa-multer');
const fs = require('fs');
// const host = require('./host');
const querySQL = require('../model/mysql/index');
const randomNum = require('../tool/randomNum');
// const host = require('./host');

// const upload = multer({ dest: './public/images' });
var storage = multer.diskStorage({
    // 文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/images/upload') // 注意路径必须存在
    },
    // 修改文件名称
    filename: async function (req, file, cb) {
        try {
            console.log(req.body)
            var fileFormat = (file.originalname).split(".");
            const num = randomNum(2)
            let sql = ''
            console.log(req.body)
            if (req.body.shopID && req.body.foodID) {
                sql = `update food_info_${req.body.shopID} set imgUrl = ? where foodID = ?`;
                await querySQL(sql, [`/images/upload/${num}.${fileFormat[fileFormat.length - 1]}`, req.body.foodID])
            } else if (req.body.shopID && !req.body.foodID) {
                sql = `update shop_list set imgUrl = ? where shopID= ?`;
                await querySQL(sql, [`/images/upload/${num}.${fileFormat[fileFormat.length - 1]}`, req.body.shopID])
            }
            if (req.body.imgUrl) {
                if (req.body.imgUrl === 'default-img.svg') {
                    return
                }
                fs.unlink(`./public/images/upload/${req.body.imgUrl}`, function(error) {
                    if(error) {
                        console.log(error);
                        return false;
                    }
                    console.log('删除文件成功');
                })
            }
            cb(null, `${num}.${fileFormat[fileFormat.length - 1]}`);
        } catch (e) {
            console.log(e)
        }
    }
})

// 加载配置
var upload = multer({ storage: storage })
router.prefix('/api/img')
// 上传图片
// router.post('/foodImgUpload', async (ctx, next) => {
//     console.log('上传图片')
// })
router.post('/uploadImg', upload.single('img'), async (ctx, next) => {
    const file = ctx.req.file
    console.log(ctx.req)
    ctx.body = {
        code: '000',
        msg: '上传成功',
        data: {
            imgUrl: `/images/upload/${file.filename}`
        }
    }
})
router.post('/delete', async (ctx, next) => {
    const query = ctx.request.body
    console.log(query)
    if (query.imgUrl) {
        const reg = /.+\/(\d+\.)/
        const imgUrl = query.imgUrl.replace(reg, '$1')
        fs.unlink(`./public/images/upload/${imgUrl}`, function(error) {
            if(error) {
                console.log(error);
                return false;
            }
            console.log('删除文件成功');
        })
    }
    ctx.body = {
        code: '000',
        msg: '删除成功',
        data: {}
    }
})

module.exports = router