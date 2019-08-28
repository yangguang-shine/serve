const router = require('koa-router')()
const httpsGet = require('../tool/httpsGet')
const dataFormat = require('../tool/dataFormat')
const identification = require('../model/wechats/identification')
const messageDelivery = require('../model/wechats/messageDelivery')
const mysqlConfig = require('../config/session-config')
const MysqlStore = require('koa2-session-mysql')
const crypto = require('crypto');

router.prefix('/wechat')

router.get('/', function (ctx, next) {
    identification(ctx)
})
router.post('/', function (ctx, next) {
    messageDelivery(ctx)
})

router.get('/wx/login', async (ctx, next) => {
    try {
        const { code } = ctx.query
        console.log(ctx.session.user)
        const res = await httpsGet(`https://api.weixin.qq.com/sns/jscode2session?appid=wx5e8fc6bbef84c4c3&secret=776934fd2bf6193cf8fd5e5af684d30c&js_code=${code}&grant_type=authorization_code`)
        const data = await dataFormat(res)
        const { session_key, openid } = JSON.parse(data)
        let sql = `select * from user_openid where openid = ?`
        const queryUser = await ctx.querySQL(sql, [openid])
        if (queryUser.length) {
            sql = `update user_openid set session_key = ? where openid = ?`
            await ctx.querySQL(sql, [session_key, openid])
        } else {
            sql = `insert into user_openid (session_key, openid) values (?, ?)`
            await ctx.querySQL(sql, [session_key, openid])
        }
        const md5 = crypto.createHash('md5');
        const session_id = await md5.update(session_key).digest('hex');
        ctx.session.user = session_id
        ctx.body = {
            code: '000',
            msg: 'code获取成功',
            data: session_id
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: 'code获取失败',
            data: null
        }
    }
})

module.exports = router
