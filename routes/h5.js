const router = require('koa-router')()
const httpsGet = require('../tool/httpsGet')
const dataFormat = require('../tool/dataFormat')
const identification = require('../model/wechats/identification')
const messageDelivery = require('../model/wechats/messageDelivery')
const checkUserLogin = require('../tool/checkUserLogin')
// const mysqlConfig = require('../config/session-config')
// const MysqlStore = require('koa2-session-mysql')

router.prefix('/h5/user')

router.post('/register', function (ctx, next) {
})
router.post('/login', function (ctx, next) {
})

router.post('/check', async (ctx, next) => {
    try {
        const { token } = ctx.request.body
        const loginStatus = await checkUserLogin(ctx.querySQL, token)
        if (loginStatus) {
            ctx.body = {
                code: '000',
                msg: '成功',
                data: true
            }
        } else {
            ctx.body = {
                code: '000',
                msg: '成功',
                data: false
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: 'token获取失败',
            data: null
        }
    }
})

module.exports = router
