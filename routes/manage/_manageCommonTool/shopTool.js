const httpsGet = require('../../../tools/httpsGet')
const httpGet = require('../../../tools/httpGet')
const { readPipe } = require('../../../tools/readPipe')
const { getImageName } = require('./imageTool')
const path = require('path')
const fs = require('fs')

const toBulkImportFood = async (ctx, options) => {
    await ctx.SQLtransaction(async (querySQL) => {
        const { shopID, categoryList } = options
        for (let i = 0; i < categoryList.length; i++) {
            await toInsertCategoryItem({ querySQL, shopID, categoryItem: categoryList[i] })
        }
    })
}
const toInsertCategoryItem = async ({ querySQL, shopID, categoryItem }) => {
    const insertCategory = `insert into shop_category_list (categoryName, shopID) values (?, ?);`
    const insertCategoryRes = await querySQL(insertCategory, [categoryItem.categoryName, shopID])
    await toDownLoadAllImg(categoryItem.foodList || [])
    const categoryID = insertCategoryRes.insertId
    await insertFoodList({ querySQL, foodList: categoryItem.foodList || [], categoryID, shopID})


}

const insertFoodList = async ({ foodList, categoryID, querySQL, shopID }) => {
    const insertFoodList = foodList.map((item) => {
        return [
            item.foodName,
            categoryID,
            item.price,
            item.unit,
            item.imgUrl,
            item.description,
            item.categoryName,
            shopID
        ]
    })
    const insertFood = `insert into shop_food_info (foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID) values ?`;
    await querySQL(insertFood, [insertFoodList])
}
const toDownLoadAllImg = async (foodList) => {
    for (let i = 0; i < foodList.length; i++)
        await downloadOneImg(foodList[i])
}

const downloadOneImg = async (item) => {
    let res = ''
    const imageName = getImageName(item.originImgUrl)
    item.imgUrl = `/upload/img/food/${imageName}`
    const distDir = path.join(__dirname, `../../../public/upload/img/food/${imageName}`)
    const fsWriteSream = fs.createWriteStream(distDir)
    try {
        if (item.originImgUrl.startsWith('https://')) {
            res = await httpsGet(item.originImgUrl)
        } else if (item.originImgUrl.startsWith('http://')) {
            res = await httpGet(item.originImgUrl)
        } else {
            return
        }
        await readPipe(res, fsWriteSream)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    toBulkImportFood
}