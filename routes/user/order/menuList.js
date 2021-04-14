// this 指向 this

module.exports = async function menuList() {
    const { shopID } = this.query
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const sql = `select * from shop_food_info where shopID = ? group by categoryID, foodID;`;
    const res = await this.querySQL(sql, [shopID])
    const AllfoodList = (res || []).reduce((list, item) => {
        if (!list.length) {
            list.push({
                categoryID: item.categoryID,
                categoryName: item.categoryName,
                foodList: [item]
            })
        } else {
            const find = list.find(Listitem => Listitem.categoryID === item.categoryID)
            if (find) {
                find.foodList.push(item)
            } else {
                list.push({
                    categoryID: item.categoryID,
                    categoryName: item.categoryName,
                    foodList: [item]
                })
            }
        }
        return list
    }, [])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: AllfoodList
    }
}