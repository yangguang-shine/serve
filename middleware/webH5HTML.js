const { readFile } = require('fs/promises')
const chalk = require('chalk')

module.exports = async (ctx, next) => {
    console.log('ctx.path')
    console.log(ctx.path)
    if (ctx.path.startsWith('/pages') || ctx.path === '/' || ctx.path.startsWith('/h5/pages')) {
    console.log('>>>>>>>>>>>>>>>>>>')
    console.log(chalk.bgRed('>>>>>>>>>>>>>>>>>>'))


        const data = await readFile('./public/h5/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    }
    await next()
}