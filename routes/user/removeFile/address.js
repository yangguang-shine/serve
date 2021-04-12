const router = require('koa-router')()

router.prefix('/api/user/address')
// 添加地址
router.get('/list', async (ctx, next) => {
    // const query = ctx.query
    try {
        const userID = await ctx.getUserID()
        const sql = `select * from address_list_${userID}`
        const res = await ctx.querySQL(sql, [])
        ctx.body = {
            code: '000',
            msg: '查询成功',
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
    try {
        const { name, sex, mobile, address1, address2 } = ctx.request.body
        const userID = await ctx.getUserID()
        const sql = `insert into address_list_${userID} (name, sex, mobile, address1, address2) values (?)`;
        const res = await ctx.querySQL(sql, [[name, sex, mobile, address1, address2]])
        const addressID = res.insertId
        await addressExchange({ querySQL: ctx.querySQL, userID, addressID })
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

// 删除地址
router.post('/delete', async (ctx, next) => {
    try {
        const { addressID } = ctx.request.body
        if (!addressID) {
            ctx.body = ctx.parameterError
            return
        }
        const userID = await ctx.getUserID()
        const sql = `delete from address_list_${userID} where addressID = ?`;
        await ctx.querySQL(sql, [addressID])
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: {}
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

// 更新地址
router.post('/edit', async (ctx, next) => {
    try {
        const { name, sex, mobile, address1, address2, addressID } = ctx.request.body
        if (!addressID) {
            ctx.body = ctx.parameterError
            return
        }
        await ctx.SQLtransaction(async(querySQL) => {
            const userID = await ctx.getUserID()
            const sql = `update address_list_${userID} set name = ?, sex = ?, mobile = ?, address1 = ?, address2 = ? where addressID = ?;`
            await querySQL(sql, [name, sex, mobile, address1, address2, addressID])
            await addressExchange({ querySQL, userID, addressID })
        })
        ctx.body = {
            code: '000',
            msg: '更新成功',
            data: null
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

// 查找地址
router.get('/find', async (ctx, next) => {
    try {
        const { addressID } = ctx.query
        if (!addressID) {
            ctx.body = ctx.parameterError
            return
        }
        const userID = await ctx.getUserID()
        const res = await ctx.querySQL(`select * from address_list_${userID} where addressID = ?;`, [addressID])
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
router.post('/default', async (ctx, next) => {
    try {
        const { addressID } = ctx.request.body
        if (!addressID) {
            ctx.body = ctx.parameterError
            return
        }
        const userID = await ctx.getUserID()
        await addressExchange({ querySQL: ctx.querySQL, userID, addressID })
        ctx.body = {
            code: '000',
            msg: '查找成功',
            data: null
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

async function addressExchange({ querySQL, userID, addressID } = {}) {
    const sql1 = `select * from address_list_${userID} where addressID = ?`
    const sql2 = `select * from address_list_${userID} limit 1`
    const findAddressPrimise = querySQL(sql1, [addressID])
    const firstAddressPrimise = querySQL(sql2, [addressID])
    let findAddress = await findAddressPrimise
    let firstAddress = await firstAddressPrimise
    if(!findAddress.length || !firstAddress.length) {
        throw Error('换位查找出错了')
    }
    if(findAddress.length) {
        findAddress = findAddress[0]
    }
    if (firstAddress.length) {
        firstAddress = firstAddress[0]
    }
    if (findAddress.addressID === firstAddress.addressID) {
        return
    }
    let { name, sex, mobile, address1, address2 } = findAddress
    const sql3 = `update address_list_${userID} set name = ?, sex = ?, mobile = ?, address1 = ?, address2 = ? where addressID = ?;`
    const promise1 = querySQL(sql3, [name, sex, mobile, address1, address2, firstAddress.addressID]);
    ({ name, sex, mobile, address1, address2 } = firstAddress);
    const promise2 = querySQL(sql3, [name, sex, mobile, address1, address2, findAddress.addressID]);
    await promise1
    await promise2
}

module.exports = router
