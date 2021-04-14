// manage > category > edit

module.exports = async function edit() {
    const { categoryName, categoryID, shopID } = this.request.body
    if (!(shopID && categoryID)) {
        this.body = this.parameterError
        return
    }
    await this.SQLtransaction(async (querySQL) => {
        let sql1 = `update shop_category_list set categoryName = ? where categoryID = ?`
        let sql2 = `update shop_food_info set categoryName = ? where categoryID = ?`
        const promise1 = querySQL(sql1, [categoryName, categoryID])
        const promise2 = querySQL(sql2, [categoryName, categoryID])
        await promise1
        await promise2
    })
    this.body = {
        code: '000',
        msg: '修改成功',
        data: null
    }
}