module.exports = async (ctx, next) => {
    if(parseInt(ctx.status) === 404) {
        console.log('4040404040404040404040440')
        ctx.body = {
            code: '111',
            msg: '该接口暂未提供',
            data: {}
        }
    }
    await next()
}