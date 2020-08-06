// manage > category > delete
const { deleteFoodImg } = require('../_manageCommonTool')

module.exports = async function remove() {
    const { categoryID, shopID } = this.request.body
    if (!(shopID && categoryID)) {
        this.body = this.parameterError
        return
    }
    const foodImgUrlList = await this.querySQL(`select imgUrl from food_info_${shopID} where categoryID = ?`, [categoryID])
    await this.SQLtransaction(async (querySQL) => {
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
    }
    this.body = {
        code: '000',
        msg: '删除成功',
        data: null
    }
}