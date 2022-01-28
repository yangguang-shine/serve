// this 指向 ctx

const { deleteFoodImg } = require('../_manageCommonTool')

module.exports = async function remove() {
    const { shopID, foodID } = this.request.body
    if (!(shopID && foodID)) {
        this.body = this.parameterError
        return
    }
    const foodImgUrlList = await this.querySQL(`select imgUrl from shop_food_info where foodID = ? and manageID = ?`, [foodID, this.manageID])
    const sql = `delete from shop_food_info where foodID = ? and manageID = ?;`;
    const res = await this.querySQL(sql, [foodID, this.manageID])
    const promiseList = []
    foodImgUrlList.forEach((foodImgItem) => {
        promiseList.push(deleteFoodImg(`./public${foodImgItem.imgUrl}`))
    })
    for (let i = 0; i < promiseList.length; i += 1) {
        await promiseList[i]
    }
    this.body = {
        code: '000',
        msg: '删除成功',
        data: res
    }

}