const { readFile } = require('fs/promises')
const chalk = require('chalk')

module.exports = async (ctx, next) => {
    if (ctx.path.startsWith('/manage')) {
        const data = await readFile('./public/manage/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    }
    await next()
}