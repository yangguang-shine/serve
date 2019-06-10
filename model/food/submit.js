const FoodInfo = require('../mongodb/FoodInfo')
module.exports = async (ctx) => {
    const name = ctx.request.body.name
    const price = ctx.request.body.price
    // const food = new FoodInfo({
    //     name,
    //     price
    // })
    // await ctx.saveOne(FoodInfo, food)
    await ctx.saveOne(FoodInfo, {
        name,
        price,
        hhh: 123
    })
    ctx.body = {
        code: '000',
        msg: '成功'
    }
}