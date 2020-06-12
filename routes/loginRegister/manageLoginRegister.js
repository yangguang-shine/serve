const router = require("koa-router")();
const encryption = require('../../tool/encryption')
const crypto = require('crypto');
router.prefix("/manage");

router.post("/login", async (ctx, next) => {
    try {
        const { phone, password } = ctx.request.body
        if (!(phone && password)) {
            ctx.body = ctx.parameterError
            return
        }
        const encryptPassword = encryption(password)
        const sql = `select encryptPassword, manageID, nickname from manage_info_pass where phone = ?`
        const phoneInfoList = await ctx.querySQL(sql, [phone])
        if (phoneInfoList.length) {
            if (phoneInfoList.length > 1) {
                console.log('多个phoneInfoList')
            }
            const phoneInfo = phoneInfoList[0];
            if (encryptPassword === phoneInfo.encryptPassword) {
                const nickname = phoneInfo.nickname
                const manageID = phoneInfo.manageID
                const md5 = crypto.createHash('md5');
                const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${phone}`
                const manageToken = await md5.update(secret).digest('hex');
                const res = await ctx.querySQL('select manageToken from manage_token_store where manageID = ?', [manageID])
                if (res.length) {
                    if (res.length > 1) {
                        console.log('多个manageID')
                    }
                    await ctx.querySQL(`update manage_token_store set manageToken = ? where manageID = ?`, [manageToken, manageID])
                } else {
                    const insertTokenSql = `insert into manage_token_store (manageID, manageToken) values (?, ?)`
                    await ctx.querySQL(insertTokenSql, [manageID, manageToken])
                }
                ctx.cookies.set('manageToken', manageToken)
                ctx.body = {
                    code: '000',
                    msg: '登录成功',
                    data: {
                        nickname,
                        manageToken
                    }
                }
            } else {
                ctx.body = {
                    code: '108',
                    msg: '密码错误',
                    data: {}
                }
            }
        } else {
            ctx.body = {
                code: '109',
                msg: '改手机号不存在',
                data: {}
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '110',
            msg: '管理员登录失败，请稍后再试',
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
        let sql = `select phone from manage_info_pass where phone = ?`
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
            const manageToken = await md5.update(secret).digest('hex');
            await ctx.SQLtransaction(async (querySQL) => {
                const sql = 'insert into manage_info_pass (phone, encryptPassword, nickname) values (?)'
                const res = await querySQL(sql, [[phone, encryptPassword, nickname]])
                const manageID = res.insertId
                const insertTokenSql = `insert into manage_token_store (manageID, manageToken) values (?, ?)`
                await querySQL(insertTokenSql, [manageID, manageToken])
            })
            ctx.cookies.set('manageToken', manageToken)
            ctx.body = {
                code: '000',
                msg: '注册成功',
                data: {
                    nickname,
                    manageToken
                }
            }
        } else {
            ctx.body = {
                code: '106',
                msg: '改手机号已被注册',
                data: {}
            }
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '107',
            msg: '管理员注册失败，请稍后再试',
            data: {}
        }
    }
});

router.post("/changePassword", async (ctx, next) => {
    const { username, password, nowPassword } = ctx.request.body
});
router.post("/checkManageLogin", async (ctx, next) => {
    try {
        const manageToken = ctx.cookies.get('manageToken')
        const status = await ctx.checkManageLogin(ctx.querySQL, manageToken)
        if (status) {
            ctx.body = {
                code: '000',
                msg: '成功',
                data: true
            }
        } else {
            ctx.body = {
                code: '888',
                msg: '管理登录过期',
                data: false
            }
        }
    } catch (e) {
        ctx.body = {
            code: '888',
            msg: '管理登录过期',
            data: false
        }
    }
});

module.exports = router;