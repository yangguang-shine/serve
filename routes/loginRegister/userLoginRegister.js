const router = require("koa-router")();
const encryption = require('../../tool/encryption')
const crypto = require('crypto');
const createUserIDOrShopIDOrderFoodList = require('../../creatTable/createUserIDOrShopIDOrderFoodList')
const createUserIDOrShopIDOrderKeyList = require('../../creatTable/createUserIDOrShopIDOrderKeyList')
const createUserIDAddress = require('../../creatTable/createUserIDAddress')
router.prefix("/user");

router.post("/login", async (ctx, next) => {
    try {
        const { phone, password } = ctx.request.body
        if (!(phone && password)) {
            ctx.body = ctx.parameterError
            return
        }
        const encryptPassword = encryption(password)
        const sql = `select encryptPassword, userID, nickname from user_info_pass where phone = ?`
        const phoneInfoList = await ctx.querySQL(sql, [phone])
        if (phoneInfoList.length) {
            if (phoneInfoList.length > 1) {
                console.log('多个phoneInfoList')
            }
            const phoneInfo = phoneInfoList[0];

            if (encryptPassword === phoneInfo.encryptPassword) {
                const nickname = phoneInfo.nickname
                const userID = phoneInfo.userID
                const md5 = crypto.createHash('md5');
                const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${phone}`
                const userToken = await md5.update(secret).digest('hex');
                const res = await ctx.querySQL('select userToken from user_token_store where userID = ?', [userID])
                if (res.length) {
                    if (res.length > 1) {
                        console.log('多个userID')
                    }
                    await ctx.querySQL(`update user_token_store set userToken = ? where userID = ?`, [userToken, userID])
                } else {
                    const insertTokenSql = `insert into user_token_store (userID, userToken) values (?, ?)`
                    await ctx.querySQL(insertTokenSql, [userID, userToken])
                }
                ctx.cookies.set('userToken', userToken)
                ctx.body = {
                    code: '000',
                    msg: '登录成功',
                    data: {
                        nickname,
                        userToken
                    }
                }
            } else {
                ctx.body = {
                    code: '101',
                    msg: '用户密码错误',
                    data: {}
                }
            }
        } else {
            ctx.body = {
                code: '102',
                msg: '用户手机号不存在',
                data: {}
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '105',
            msg: '用户登录失败，请稍后再试',
            data: {}
        }
    }
});

router.post("/register", async (ctx, next) => {
    try {
        const { phone, password, nickname } = ctx.request.body
        if (!(phone && password && nickname)) {
            ctx.body = ctx.parameterError
            return
        }
        const encryptPassword = encryption(password)
        let phoneIsexit = false
        let sql = `select phone from user_info_pass where phone = ?`
        const phoneList = await ctx.querySQL(sql, [phone]);
        if (phoneList.length) {
            phoneIsexit = true
            if (phoneList.length > 1) {
                console.log('相同phone有多个')
            }
        }
        if (!phoneIsexit) {
            const md5 = crypto.createHash('md5');
            const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${phone}`
            const userToken = await md5.update(secret).digest('hex');
            await ctx.SQLtransaction(async (querySQL) => {
                const sql = 'insert into user_info_pass (phone, encryptPassword, nickname) values (?)'
                const res = await querySQL(sql, [[phone, encryptPassword, nickname]])
                const userID = res.insertId
                const insertTokenSql = `insert into user_token_store (userID, userToken) values (?, ?)`
                await querySQL(insertTokenSql, [userID, userToken])
                const createUserIDOrderFoodListPromise = createUserIDOrShopIDOrderFoodList({ querySQL, userID })
                const createUserIDOrderKeyListPromise = createUserIDOrShopIDOrderKeyList({ querySQL, userID })
                const createUserIDAddressPromise = createUserIDAddress({ querySQL, userID })
                await createUserIDOrderFoodListPromise
                await createUserIDOrderKeyListPromise
                await createUserIDAddressPromise
            })
            ctx.cookies.set('userToken', userToken)
            ctx.body = {
                code: '000',
                msg: '注册成功',
                data: {
                    nickname,
                    userToken
                }
            }
        } else {
            ctx.body = {
                code: '103',
                msg: '用户改手机号已被注册',
                data: {}
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '104',
            msg: '用户注册失败，请稍后再试',
            data: {}
        }
    }
});

router.post("/changePassword", async (ctx, next) => {
    const { username, password, nowPassword } = ctx.request.body
});

module.exports = router;