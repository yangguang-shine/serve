const router = require('koa-router')()
const { deleteFoodImg } = require('../../utils')

router.prefix('/manage/food')
// 添加菜品
router.get('/list', async (ctx, next) => {
    const { shopID, categoryID } = ctx.query
    if (!(shopID && categoryID)) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const sql = `select * from food_info_${shopID} where categoryID = ?;`
        const res = await ctx.querySQL(sql, [categoryID])
        ctx.body = {
            code: '000',
            msg: '查询成功',
            data: res
        }
    } catch (e) {
        ctx.body = {
            code: '111',
            msg: '查询失败',
            data: null
        }
    }
})
router.post('/add', async (ctx, next) => {
    const { foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID } = ctx.request.body
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const sql = `insert into food_info_${shopID} (foodName, categoryID, price, unit, imgUrl, description, categoryName) values (?, ?, ?, ?, ?, ?, ?)`;
        await ctx.querySQL(sql, [foodName, categoryID, price, unit, imgUrl, description, categoryName])
        ctx.body = {
            code: '000',
            msg: '添加成功',
            data: null
        }
    } catch (e) {
        ctx.body = {
            code: '111',
            msg: '添加失败',
            data: null
        }
    }
})

// 删除菜品
router.post('/delete', async (ctx, next) => {
    const { shopID, foodID } = ctx.request.body
    if (!(shopID && foodID)) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const foodImgUrlList = await ctx.querySQL(`select imgUrl from food_info_${shopID} where foodID = ?`, [foodID])
        const sql = `delete from food_info_${shopID} where foodID = ?;`;
        const res = await ctx.querySQL(sql, [foodID])
        try {
            const promiseList = []
            foodImgUrlList.forEach((foodImgItem) => {
                promiseList.push(deleteFoodImg(`./public${foodImgItem.imgUrl}`))
            })
            for (let i = 0; i < promiseList.length; i += 1) {
                await promiseList[i]
            }
        } catch (e) {
            console.log(e)
        }
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: res
        }
    } catch (e) {
        ctx.body = {
            code: '111',
            msg: '删除失败',
            data: null
        }
    }
})

// 更新菜品
router.post('/edit', async (ctx, next) => {
    const { shopID, foodName, price, unit, imgUrl, description, foodID } = ctx.request.body
    if (!(shopID && foodID)) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const sql = `update food_info_${shopID} set foodName = ?, price = ?, unit = ?, imgUrl = ?, description = ? where foodID = ?;`
        const res = await ctx.querySQL(sql, [foodName, price, unit, imgUrl, description, foodID])
        ctx.body = {
            code: '000',
            msg: '更新成功',
            data: res
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '更新失败',
            data: null
        }
    }
})

// 查找菜品
router.get('/find', async (ctx, next) => {
    try {
        const query = ctx.query
        if (!query.foodID) {
            ctx.body = ctx.parameterError
            return
        }
        const res = await ctx.querySQL(`select * from food_info_${query.shopID} where foodID = ?;`, [Number(query.foodID)])
        let data = {}
        if (res.length) {
            data = res[0]
        }
        ctx.body = {
            code: '000',
            msg: '查找成功',
            data
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '查找失败',
            data: null
        }
    }
})

module.exports = router
