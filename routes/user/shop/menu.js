// this 指向 this

module.exports = async function menu() {
    const { shopID } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const sql = `select categoryID,categoryName,description,foodID,foodName,imgUrl,shopID,packPrice,price,reserveCount,unit,orderCount from shop_food_info where shopID = ?`;
    const sql1 = `select categoryID,categoryName,required from shop_category_list where shopID = ?`;
    const sqlPromise = this.querySQL(sql, [shopID])
    const sql1Promise = this.querySQL(sql1, [shopID])
    const foodList = await sqlPromise
    const categoryList = await sql1Promise
    this.body = {
        code: '000',
        msg: '查询成功',
        data: {
            foodList,
            categoryList
        }
    }
}