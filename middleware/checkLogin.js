const chalk = require('chalk')
// const getUserID = require('../tools/getUserID')
const { userLoginInfo, manageLoginInfo, ignoreLoginInfo } = require('../constant')
const getUserID = async (ctx) => {
    const userToken = ctx.cookies.get('userToken')
    console.log('userToken')
    console.log(userToken)
    const sql = `select userID from token_store_user where userToken = ?`
    const userIDList = await ctx.querySQL(sql, [userToken])
    let userID = ''
    if (userIDList.length) {
        userID = userIDList[0].userID
    } else {
        throw new Error('无userID')
    }
    return userID
}
const getManageID = async (ctx) => {
    const manageToken = ctx.cookies.get('manageToken')
    const sql = `select manageID from token_store_manage where manageToken = ?`
    const manageIDList = await ctx.querySQL(sql, [manageToken])
    let manageID = ''
    if (manageIDList.length) {
        manageID = manageIDList[0].manageID
    } else {
        throw new Error('无manageID')
    }
    return manageID
}
module.exports = async (ctx, next) => {
    if (userLoginInfo[ctx.url]) {
        try {
            ctx.userID = await getUserID(ctx)
            await next()
        } catch(e) {
           console.log(e)
           ctx.body = {
            code: '100',
            msg: '请重新登录',
            data: null
           }
        } 
    } else if (manageLoginInfo[ctx.url]) {
        try {
            ctx.manageID = await getManageID(ctx)
            await next()
        } catch(e) {
           console.log(e)
           ctx.body = {
            code: '200',
            msg: '请重新登录',
            data: null
           }
        } 
    } else if (ignoreLoginInfo[ctx.url]) {
        await next()
    } else {
        // await next()
        console.log(chalk.bgRed('未注册接口'))
        console.log(chalk.bgRed(ctx.url))
        ctx.body = {
         code: '400',
         msg: '接口未注册',
         data: null
        }
        // throw Error ('接口为注册' + '>>>>>>>' + ctx.url)
    }
}