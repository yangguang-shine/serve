// manage > category > delete
const { deleteFoodImg } = require('../_manageCommonTool')

module.exports = async function remove() {
    // const { categoryID, shopID } = this.request.body
    const { categoryIDList = [], shopID } = this.request.body
    if (!(shopID && categoryIDList.length)) {
        this.body = this.parameterError
        return
    }
    const deleteCategoryStr = `(${categoryIDList.reduce((str, categoryID) => {
        if (str) {
            str = `${str} or categoryID = ?`
        } else {
            str = `categoryID = ?`
        }
        return str
    }, '')})`
    console.log(deleteCategoryStr)
    // return
    const foodImgUrlList = await this.querySQL(`select imgUrl from shop_food_info where shopID = ? and ${deleteCategoryStr}`, [shopID, ...categoryIDList])
    await this.SQLtransaction(async (querySQL) => {
        const deleteCategoryListSql = `delete from shop_category_list where shopID = ? and ${deleteCategoryStr};`
        const deleteshopFoodListSql = `delete from shop_food_info where shopID = ? and ${deleteCategoryStr};`
        const deleteCategoryListPromise = await querySQL(deleteCategoryListSql, [shopID, ...categoryIDList])
        const deleteshopFoodListSqlPromise = await querySQL(deleteshopFoodListSql, [shopID, ...categoryIDList])
        await deleteCategoryListPromise
        await deleteshopFoodListSqlPromise
    })
    try {
        const promiseList = []
        foodImgUrlList.forEach((foodImgItem) => {
            promiseList.push(deleteFoodImg(`./public/image/food/${shopID}/${foodImgItem.imgUrl}`))
        })
        for (let i = 0; i < promiseList.length; i += 1) {
            await promiseList[i]
        }
    } catch (e) {
        console.log(e)
    }
    this.body = {
        code: '000',
        msg: '删除成功',
        data: null
    }
}