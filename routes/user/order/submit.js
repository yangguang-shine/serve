// this 指向 this

const randomNum = require('../../../tools/randomNum');

module.exports = async function submit() {
    const orderKey = randomNum()
    const orderTime = new Date()
    const { shopID, orderAmount, foodList, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, originOrderAmount } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const userID = await this.getUserID()
    await this.SQLtransaction(async (querySQL) => {
        const valuesUserID = [orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, originOrderAmount]
        const valuesShopID = [orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, userID, originOrderAmount]
        const sql = `insert into order_key_list_${userID} (orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, originOrderAmount) values (?);`
        const insertOrderKeyPromise = await querySQL(sql, [valuesUserID])
        const insertOrderPromise = await insertOrderFoodList({ querySQL: querySQL, foodList, orderKey, userID })
        const shopSQL = `insert into order_key_list_${shopID} (orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, userID, originOrderAmount) values (?);`
        const insertShopIDOrderKeyPromise = await querySQL(shopSQL, [valuesShopID])
        const insertShopIDOrderPromise = await insertOrderFoodList({ querySQL: querySQL, foodList, orderKey, shopID })
        await insertOrderKeyPromise
        await insertOrderPromise
        await insertShopIDOrderKeyPromise
        await insertShopIDOrderPromise
    })
    this.body = {
        code: '000',
        msg: '提交成功',
        data: orderKey
    }
}

async function insertOrderFoodList({ querySQL, foodList, orderKey, userID = '', shopID = '' } = {}) {
    let sql = ''
    if(userID) {
        sql = `insert into order_food_list_${userID} (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey) values ?`
    } else if (shopID) {
        sql = `insert into order_food_list_${shopID} (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey) values ?`
    }
    const values = []
    foodList.forEach((item) => {
        const foodID = item.foodID
        const orderCount = item.orderCount
        const imgUrl = item.imgUrl
        const foodName = item.foodName
        const categoryID = item.categoryID
        const categoryName = item.categoryName
        const price = item.price
        const unit = item.unit
        const description = item.description
        values.push([foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey])
    })
    await querySQL(sql, [values])
}