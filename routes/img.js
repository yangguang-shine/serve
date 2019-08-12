const router = require('koa-router')()
const multer = require('koa-multer');
const fs = require('fs');
const host = require('./host');
const querySQL = require('../model/mysql/index');
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
            console.log(req)
            var fileFormat = (file.originalname).split(".");
            const data = +Date.now();
            const sql = 'update food_info set imgUrl = ? where = ?';
            await querySQL(sql, [`${data}.${fileFormat[fileFormat.length - 1]}`, req.query.foodID])
            fs.unlink(`./public/images/upload/${file.originalname}`, function(error) {
                if(error) {
                    console.log(error);
                    return false;
                }
                console.log('删除文件成功');
            })
            cb(null, data + "." + fileFormat[fileFormat.length - 1]);
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
    console.log(ctx.req.file)
    console.log(ctx.request.file)
    const file = ctx.req.file
    ctx.body = {
        code: '000',
        msg: '上传成功',
        data: {
            imgUrl: `${host}/images/upload/${file.filename}`
        }
    }
})

module.exports = router