// this 指向 ctx
const { createUserIDOrShopIDOrderFoodList, createUserIDOrShopIDOrderKeyList, createCategory, createFoodInfo } = require('../../../creatTable')

module.exports = async function add() {
    const { shopName, imgUrl, startTime, endTime, address, minus, businessTypes } = this.request.body
    await this.SQLtransaction(async (querySQL) => {
        const manageID = await this.getManageID()
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
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}