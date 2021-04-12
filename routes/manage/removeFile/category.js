const router = require('koa-router')();
const { deleteFoodImg } = require('../../utils')
router.prefix('/api/manage/category')
// 添加菜品
router.get('/list', async (ctx, next) => {
    const { shopID } = ctx.query
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        let sql = `select * from category_list_${shopID};`;
        const res = await ctx.querySQL(sql)
        ctx.body = {
            code: '000',
            msg: '获取成功',
            data: res
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '查询失败',
            data: null
        }
    }
})
router.post('/add', async (ctx, next) => {
    const { categoryName, shopID } = ctx.request.body
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        let sql = `insert into category_list_${shopID} (categoryName, shopID) values (?, ?);`
        const res = await ctx.querySQL(sql, [categoryName, shopID])
        console.log(res)
        ctx.body = {
            code: '000',
            msg: '添加成功',
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '添加失败',
            data: null
        }
    }
})
router.post('/delete', async (ctx, next) => {
    const { categoryID, shopID } = ctx.request.body
    if (!(shopID && categoryID)) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const foodImgUrlList = await ctx.querySQL(`select imgUrl from food_info_${shopID} where categoryID = ?`, [categoryID])
        await ctx.SQLtransaction(async (querySQL) => {
            let sql = `delete from category_list_${shopID} where categoryID = ?; delete from food_info_${shopID} where categoryID = ?`
            await querySQL(sql, [categoryID, categoryID])
        })
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
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '删除失败',
            data: null
        }
    }
})
router.post('/edit', async (ctx, next) => {
    const { categoryName, categoryID, shopID } = ctx.request.body
    if (!(shopID && categoryID)) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        await ctx.SQLtransaction(async (querySQL) => {
            let sql1 = `update category_list_${shopID} set categoryName = ? where categoryID = ?`
            let sql2 = `update food_info_${shopID} set categoryName = ? where categoryID = ?`
            const promise1 = querySQL(sql1, [categoryName, categoryID])
            const promise2 = querySQL(sql2, [categoryName, categoryID])
            await promise1
            await promise2
        })
        ctx.body = {
            code: '000',
            msg: '修改成功',
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '修改失败',
            data: null
        }
    }
})
module.exports = router
