

module.exports = async function simpleRouterTryCatchHandle(handle, errorObj = {}, next) {
    try {
        await handle.call(this, next)
        // await handle(ctx, next)
    } catch (e) {
        console.log('error')
        console.log(e)
        this.body = {
            code: errorObj.code || '111',
            msg: errorObj.msg || '查询错误',
            data: errorObj.data || {}
        }
    }
}