const httpsGet = require('../../../tools/httpsGet')
const httpGet = require('../../../tools/httpGet')
const { readPipe } = require('../../../tools/readPipe')
const { getImageName } = require('./imageTool')
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
 
const toBulkImportFood = async (ctx, options) => {
    await ctx.SQLtransaction(async (querySQL) => {
        const { shopID, categoryList } = options
        for (let i = 0; i < categoryList.length; i++) {
            await toInsertCategoryItem({ querySQL, shopID, categoryItem: categoryList[i], manageID: ctx.manageID })
        }
    })
}
const toInsertCategoryItem = async ({ querySQL, shopID, categoryItem, manageID }) => {
    const insertCategory = `insert into shop_category_list (categoryName, shopID, manageID) values (?, ?, ?);`
    const insertCategoryRes = await querySQL(insertCategory, [categoryItem.categoryName, shopID, manageID])
    const categoryID = insertCategoryRes.insertId
    await createFoodShopDir(shopID)
    await toDownLoadAllImg(categoryItem.foodList || [])
    await insertFoodList({ querySQL, foodList: categoryItem.foodList || [], categoryID, shopID, manageID })
}
async function createFoodShopDir(shopID) {
    const foodImgDir = path.join(__dirname, `../../../public/uploadImg/food/${shopID}`)
    console.log(foodImgDir)
    try {
        await fsPromise.access(foodImgDir)
    } catch (error) {
        console.log(1111)
        console.log(error)
        await fsPromise.mkdir(foodImgDir)
    }
}

const insertFoodList = async ({ foodList, categoryID, querySQL, shopID, manageID }) => {
    const insertFoodList = foodList.map((item) => {
        return [
            item.foodName,
            categoryID,
            item.price,
            item.unit,
            item.imgUrl,
            item.description,
            item.categoryName,
            shopID,
            manageID,
            item.packPrice,
            99
        ]
    })
    const insertFood = `insert into shop_food_info (foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID,manageID,packPrice, reserveCount) values ?`;
    console.log(insertFoodList)
    await querySQL(insertFood, [insertFoodList])
}
const toDownLoadAllImg = async (foodList) => {
    for (let i = 0; i < foodList.length; i++) {
        await downloadOneImg(foodList[i])
    }
}

const downloadOneImg = async (item) => {
    let res = ''
    const imageName = getImageName(item.originImgUrl)
    item.imgUrl = imageName
    const distDir = path.join(__dirname, `../../../public/uploadImg/food/${item.shopID}/${imageName}`)
    const fsWriteSream = await fs.createWriteStream(distDir)
    fsWriteSream.on('error', (e) => {
        console.log(e)
    })
    if (item.originImgUrl.startsWith('https://')) {
        res = await httpsGet(item.originImgUrl + '@200w')
    } else if (item.originImgUrl.startsWith('http://')) {
        res = await httpGet(item.originImgUrl + '@200w')
    } else {
        return
    }
    await readPipe(res, fsWriteSream)


}

module.exports = {
    toBulkImportFood
}