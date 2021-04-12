const router = require('koa-router')()
const createCategory = require('../../creatTable/createCategory')
const createFoodInfo = require('../../creatTable/createFoodInfo')
const createUserIDOrShopIDOrderFoodList = require('../../creatTable/createUserIDOrShopIDOrderFoodList')
const createUserIDOrShopIDOrderKeyList = require('../../creatTable/createUserIDOrShopIDOrderKeyList')
const { deleteShopImg, deleteFoodImg } = require('../../utils');
const { toBulkImportFood } = require('./shopTool/index')



const httpsGet = require('../../tools/httpsGet')
const httpGet = require('../../tools/httpGet')
const dataFormat = require('../../tools/dataFormat')
const { writeFile } = require('../../tools/fsPromise')
const { getImageName } = require('./imageTool/index')
const path = require('path')
const fs = require('fs')

router.prefix('/api/manage/shop')
// 添加菜品
router.get('/list', async (ctx, next) => {
    let res = []
    try {
        const manageID = await ctx.getManageID()
        const sql = 'select * from shop_list where manageID = ?'
        res = await ctx.querySQL(sql, [manageID])
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
    const { shopName, imgUrl, startTime, endTime, address, minus, businessTypes } = ctx.request.body
    try {
        await ctx.SQLtransaction(async (querySQL) => {
            const manageID = await ctx.getManageID()
            const sql = 'insert into shop_list (shopName, imgUrl, startTime, endTime, address, minus, businessTypes, manageID) values (?, ?, ?, ?, ?, ?, ?, ?)';
            const res = await querySQL(sql, [shopName, imgUrl, startTime, endTime, address, minus, businessTypes, manageID])
            const shopID = res.insertId
            // throw Error(111)
            const createUserIDOrShopIDOrderFoodListPromise = createUserIDOrShopIDOrderFoodList({ querySQL, shopID })
            const createUserIDOrShopIDOrderKeyListPromise = createUserIDOrShopIDOrderKeyList({ querySQL, shopID })
            const createCategoryPromise = createCategory(querySQL, shopID)
            const createFoodInfoPromise = createFoodInfo(querySQL, shopID)
            await createUserIDOrShopIDOrderFoodListPromise
            await createUserIDOrShopIDOrderKeyListPromise
            await createCategoryPromise
            await createFoodInfoPromise
        })
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

// 删除菜品
router.post('/delete', async (ctx, next) => {
    const { shopID } = ctx.request.body
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const shopImgUrlList = await ctx.querySQL(`select imgUrl from shop_list where shopID = ?`, [shopID])
        const foodImgUrlList = await ctx.querySQL(`select imgUrl from food_info_${shopID}`, [])
        await ctx.SQLtransaction(async (querySQL) => {
            const sql1 = `delete from shop_list where shopID = ?`;
            const sql2 = `drop table if exists category_list_${shopID};`;
            const sql3 = `drop table if exists food_info_${shopID};`;
            const sql4 = `drop table if exists order_food_list_${shopID};`;
            const sql5 = `drop table if exists order_key_list_${shopID};`;
            const promise1 = querySQL(sql1, [shopID])
            const promise2 = querySQL(sql2, [shopID])
            const promise3 = querySQL(sql3, [shopID])
            const promise4 = querySQL(sql4, [shopID])
            const promise5 = querySQL(sql5, [shopID])
            await promise1
            await promise2
            await promise3
            await promise4
            await promise5
        })
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

// 更新菜品
router.post('/edit', async (ctx, next) => {
    const { shopName, imgUrl, startTime, endTime, address, minus, businessTypes, shopID } = ctx.request.body
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const sql = 'update shop_list set shopName = ?, imgUrl = ?, startTime = ?, endTime = ?, address = ?, minus = ?, businessTypes = ? where shopID = ?;'
        const res = await ctx.querySQL(sql, [shopName, imgUrl, startTime, endTime, address, minus, businessTypes, shopID])
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
        if (!query.shopID) {
            ctx.body = ctx.parameterError
            return
        }
        const res = await ctx.querySQL('select * from shop_list where shopID = ?;', [Number(query.shopID)])
        let data = {}
        if (res.length) {
            data = res[0]
            ctx.body = {
                code: '000',
                msg: '查找成功',
                data
            }
        } else {
            ctx.body = {
                code: '111',
                msg: '查找失败',
                data: null
            }
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

// 批量导入菜品信息
router.post('/bulkImportFood', async (ctx, next) => {
    try {
        const { categoryList, shopID } = ctx.request.body
        if (!(shopID && categoryList.length)) {
            ctx.body = ctx.parameterError
            return
        }
        await toBulkImportFood(ctx, {
            shopID,
            categoryList
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

// 批量导入菜品信息
// router.post('/img', async (ctx, next) => {
//     try {
//         const imgUrl = 'http://p0.meituan.net/xianfu/e6cac7bae7b9d776fdc158fe2314a2bd50176.jpg'
//         const imageName = getImageName(imgUrl)
//         const distDir = path.join(__dirname, `../../public/upload/img/food/${imageName}`)
//         const res = await httpGet(imgUrl)
//         // const data = await dataFormat(res, 'binary')
//                     // const fsReadSream = fs.createReadStream(data)
//             const fsWriteSream = fs.createWriteStream(distDir)
//             res.pipe(fsWriteSream).on('finish', () => {
//                 console.log('写入已完成');
//               }).on('error', () => {
//                 console.log('写入失败');
//               }) 
       
//             // console.log(2)
//             // console.log(res.pipe(fsWriteSream))
//         // await writeFile(distDir, data, {
//         //     encoding: 'binary'
//         // })
//         ctx.body = {
//             code: '000',
//             msg: '更新成功',
//             data: null
//         }
//     } catch (e) {
//         console.log(e)
//         ctx.body = {
//             code: '111',
//             msg: '更新失败',
//             data: null
//         }
//     }
// })

module.exports = router
