

module.exports = async function simpleRouterTryCatchHandle(handle, errorMsgObj, next) {
    try {
        await handle.call(this, next)
    } catch (e) {
        console.log(e)
        this.body = {
            code: errorMsgObj.code || '111',
            msg: errorMsgObj.msg || '查询错误',
            data: errorMsgObj.data === undefined ? {} : errorMsgObj.data
        }
    }
}