// this 指向 this

const randomNum = require('../../../tools/randomNum');

module.exports = async function submit() {
    const orderKey = randomNum()
    const orderTime = +new Date()
    const { shopID, payPrice, foodList = [], minusPrice, allPackPrice, deliverPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, orderOriginAmount, noteText } = this.request.body
    if (!shopID || !foodList.length) {
        this.body = this.parameterError
        return
    }
    await this.SQLtransaction(async (querySQL) => {
        // 插入order_key_list
        const orderKeyValues = [orderKey, shopID, payPrice, orderTime, minusPrice, allPackPrice, deliverPrice, businessType, reservePhone, selfTakeTime, address, 10, takeOutTime, orderOriginAmount, noteText, this.userID]
        // 插入 order_food_list
        const foodListValues = []
        const orderFoodIDList = []
        const orderFoodIDMap = {}
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
            const specification = item.specification || '[]'
            const orderSpecifaListJSON = JSON.stringify(item.orderSpecifaList || [])

            foodListValues.push([foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey, shopID, this.userID, specification, orderSpecifaListJSON])
            orderFoodIDList.push(foodID)
            orderFoodIDMap[foodID] = orderCount
        })
        // await querySQL(sql, [values])
        const { overReserveFlag, overReserveList, foodInfoList } = await checkoutOrderReserveCount({
            orderFoodIDList,
            querySQL,
            orderFoodIDMap,
        })
        if (overReserveFlag) {
            throw {
                code: '350',
                msg: '库存不足',
                data: {
                    overReserveList
                }
            }
        } else {
            const handleFoodIDListReserveReducePromise = updateFoodInfoListReserveCount({
                querySQL,
                orderFoodIDList,
                orderFoodIDMap,
                foodInfoList
            })
            const insertOrderKeyListPromise = insertOrderKeyList({
                querySQL,
                orderKeyValues
            })
            const insertOrderFoodListPromise = insertOrderFoodList({
                querySQL,
                foodListValues
            })
            await handleFoodIDListReserveReducePromise
            await insertOrderKeyListPromise
            await insertOrderFoodListPromise
        }
    })
    this.body = {
        code: '000',
        msg: '提交成功',
        data: orderKey
    }
}
async function checkoutOrderReserveCount({
    orderFoodIDList = [],
    orderFoodIDMap = {},
    querySQL,
}) {
    const length = orderFoodIDList.length
    const sqlReserveCountListSQL = orderFoodIDList.reduce((sql, foodIDItem, index) => {
        if (index === 0) {
            sql = `select foodID, reserveCount from shop_food_info where foodID = ?`;
        } else {
            sql = `${sql} or foodID = ?${index + 1 === length ? ';' : ''}`
        }
        return sql
    }, '')
    const foodInfoList = await querySQL(sqlReserveCountListSQL, orderFoodIDList)
    // const tlist1 = [
    //     { foodID: 11176, reserveCount: 9 },
    //     { foodID: 11178, reserveCount: 10 }
    // ]
    let overReserveFlag = false
    const overReserveList = []
    foodInfoList.forEach((item) => {
        if (orderFoodIDMap[item.foodID] > item.reserveCount) {
            overReserveFlag = true
            overReserveList.push({
                foodID: item.foodID,
                orderCount: item.reserveCount
            })
        }
    })
    return {
        overReserveFlag,
        overReserveList,
        foodInfoList
    }
}
async function updateFoodInfoListReserveCount({
    querySQL,
    orderFoodIDList = [],
    orderFoodIDMap = {},
    foodInfoList = []
}) {
    const updateFoodIDMap = {};
    foodInfoList.forEach((foodInfoItem) => {
        updateFoodIDMap[foodInfoItem.foodID] = foodInfoItem.reserveCount - orderFoodIDMap[foodInfoItem.foodID]
    })
    const sql = `
    UPDATE shop_food_info SET
    reserveCount = CASE foodID
    ${orderFoodIDList.reduce((str, foodID, index) => {
        str = str + `WHEN ${foodID} THEN ${updateFoodIDMap[foodID]} `
        return str
    }, '')}
    END
    WHERE foodID IN (${orderFoodIDList.join(',')})`
    await querySQL(sql)
    //    throw 111
}


async function insertOrderKeyList({
    querySQL,
    orderKeyValues
}) {
    const insertOrderKeyListSQL = `insert into order_key_list (orderKey, shopID, payPrice, orderTime, minusPrice, allPackPrice, deliverPrice, businessType, reservePhone, selfTakeTime, address,orderStatus, takeOutTime, orderOriginAmount, noteText, userID) values (?);`
    await querySQL(insertOrderKeyListSQL, [orderKeyValues])
}
async function insertOrderFoodList({ querySQL, foodListValues = [] }) {
    const insertOrderFoodListSQL = 'insert into order_food_list (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey, shopID, userID, specification, orderSpecifaListJSON) values ?'
    await querySQL(insertOrderFoodListSQL, [foodListValues])
}

// specification
// orderSpecifaList