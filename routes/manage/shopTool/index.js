const httpsGet = require('../../../tool/httpsGet')
const httpGet = require('../../../tool/httpGet')
const { readPipe } = require('../../../tool/fsPromise')
const { getImageName } = require('../imageTool/index')
const path = require('path')
const fs = require('fs')

const toBulkImportFood = async (ctx, options) => {
    await ctx.SQLtransaction(async (querySQL) => {
        const { shopID, categoryList } = options
        const promiseList = []
        categoryList.forEach((categoryItem) => {
            const promise = toInsertCategoryItem(querySQL, shopID, categoryItem)
            promiseList.push(promise)
        })
        for (let i = 0; i < promiseList.length; i++) {
            await promiseList[i]
        }
    })
}
const toInsertCategoryItem = async (querySQL, shopID, categoryItem) => {
    const dowmLoadImgPromiseList = [];
    (categoryItem.foodList || []).forEach((item) => {
        const promise = downloadImg(item)
        dowmLoadImgPromiseList.push(promise)
    })

    for (let i = 0; i < dowmLoadImgPromiseList.length; i++) {
        dowmLoadImgPromiseList[i]
    }
    const insertCategory = `insert into category_list_${shopID} (categoryName, shopID) values (?, ?);`
    const insertCategoryPromise = querySQL(insertCategory, [categoryItem.categoryName, shopID])
    const insertCategoryRes = await insertCategoryPromise
    const categoryID = insertCategoryRes.insertId
    const foodList = (categoryItem.foodList || []).map((item) => {
        return [
            item.foodName,
            categoryID,
            item.price,
            item.unit,
            item.imgUrl,
            item.description,
            item.categoryName,
        ]
    })
    const insertFood = `insert into food_info_${shopID} (foodName, categoryID, price, unit, imgUrl, description, categoryName) values ?`;
    const insertFoodRes = await querySQL(insertFood, [foodList])
    console.log(insertFoodRes)
}

const downloadImg = async (item) => {
    let res = ''
    const reg = /^https:\/\//
    const imageName = getImageName(item.originImgUrl)
    item.imgUrl = `/upload/img/food/${imageName}`
    const distDir = path.join(__dirname, `../../../public/upload/img/food/${imageName}`)
    const fsWriteSream = fs.createWriteStream(distDir)
    try {
        if (reg.test(item.originImgUrl)) {
            res = await httpsGet(item.originImgUrl)
        } else {
            res = await httpGet(item.originImgUrl)
        }
        await readPipe(res, fsWriteSream)
    } catch (e) {
        console.log(e)
    }

}

module.exports = {
    toBulkImportFood
}