const { readFile } = require('fs/promises')
const chalk = require('chalk')

module.exports = async (ctx, next) => {
    if (ctx.path.startsWith('/pages') || ctx.path === '/' || ctx.path.startsWith('/h5/pages')) {
        const data = await readFile('./public/h5/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    }
    await next()
}