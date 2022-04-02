const router = require('koa-router')()
const httpsGet = require('../../tools/httpsGet')
const identification = require('../../model/wechats/identification')
const messageDelivery = require('../../model/wechats/messageDelivery')
// const mysqlConfig = require('../config/session-config')
// const MysqlStore = require('koa2-session-mysql')
const createUserIDOrShopIDOrderFoodList = require('../../creatTable/createUserIDOrShopIDOrderFoodList')
const createUserIDOrShopIDOrderKeyList = require('../../creatTable/createUserIDOrShopIDOrderKeyList')
const createUserIDAddress = require('../../creatTable/createUserIDAddress')
const crypto = require('crypto');

router.prefix('/api/wechat')

router.post('/', function (ctx, next) {
    identification(ctx)
})
router.post('/', function (ctx, next) {
    messageDelivery(ctx)
})

router.post('/wx/login', async (ctx, next) => {
    try {
        let token = ''
        const { code } = ctx.query
        if (!code) {
            ctx.body = ctx.parameterError
        }
        await ctx.SQLtransaction(async (querySQL) => {
            const res = await httpsGet(`https://api.weixin.qq.com/sns/jscode2session?appid=wx5e8fc6bbef84c4c3&secret=776934fd2bf6193cf8fd5e5af684d30c&js_code=${code}&grant_type=authorization_code`)
            const data = await ctx.dataFormat(res)
            const { session_key, openid } = JSON.parse(data)
            let sql = `select userID from pass_info_user where openid = ?`
            let queryUserIDList = await querySQL(sql, [openid])
            let userID = null
            // 增加更新用户
            if (queryUserIDList.length === 1) {
                sql = `update pass_info_user set session_key = ? where openid = ?`
                await querySQL(sql, [session_key, openid])
                userID = queryUserIDList[0].userID
            } else if (!queryUserIDList.length) {
                sql = `insert into pass_info_user (session_key, openid) values (?, ?)`
                const resInsert = await querySQL(sql, [session_key, openid])
                console.log(res.insertId)
                userID = resInsert.insertId
                const createUserIDOrderFoodListPromise = createUserIDOrShopIDOrderFoodList({ querySQL, userID })
                const createUserIDOrderKeyListPromise = createUserIDOrShopIDOrderKeyList({ querySQL, userID })
                const createUserIDAddressPromise = createUserIDAddress({ querySQL, userID })
                await createUserIDOrderFoodListPromise
                await createUserIDOrderKeyListPromise
                await createUserIDAddressPromise
            } else {
                console.log('userID查找多个+')
                userID = queryUserIDList[0].userID
            }
            const md5 = crypto.createHash('md5');
            const secret = `${session_key}${+new Date()}${openid}`
            token = await md5.update(secret).digest('hex');
            sql = `select token from token_store_user where userID = ?`
            const findToken = await querySQL(sql, [userID])
            // 增加更新用户token
            if (findToken.length === 1) {
                sql = `update token_store_user set token = ?, secret = ?  where userID = ?`
                await querySQL(sql, [token, secret, userID])
            } else if (!findToken.length) {
                sql = `insert into token_store_user (userID, token, secret) values (?, ?, ?)`
                await querySQL(sql, [userID, token, secret])
            } else {
                throw new Error('userID查找多个++')
            }
        })
        ctx.body = {
            code: '000',
            msg: 'code获取成功',
            data: token
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
