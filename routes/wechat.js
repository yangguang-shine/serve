const router = require('koa-router')()
const httpsGet = require('../tool/httpsGet')
const dataFormat = require('../tool/dataFormat')
const identification = require('../model/wechats/identification')
const messageDelivery = require('../model/wechats/messageDelivery')

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
        const res = await httpsGet(`https://api.weixin.qq.com/sns/jscode2session?appid=wx5e8fc6bbef84c4c3&secret=776934fd2bf6193cf8fd5e5af684d30c&js_code=${code}&grant_type=authorization_code`)
        console.log('res')
        console.log(res)
        const data = await dataFormat(res)
        console.log(data)
        const { session_key, openid } = JSON.parse(data)
        console.log(session_key)
        console.log(openid)
        console.log(data.openid)
        let sql = `select * from user_openid where openid = ?`
        const queryUser = await ctx.querySQL(sql, [openid])
        console.log(queryUser.length)
        if (queryUser.length) {
            sql = `update user_openid set session_key = ? where openid = ?`
            await ctx.querySQL(sql, [session_key, openid])
        } else {
            sql = `insert into user_openid (session_key, openid) values (?, ?)`
            await ctx.querySQL(sql, [session_key, openid])
        }
        ctx.body = {
            code: '000',
            msg: 'code获取成功',
            data: data
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
