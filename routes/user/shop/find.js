
module.exports = async function find() {
    const query = this.query
    if (!query.shopID) {
        this.body = this.parameterError
        return
    }
    const res = await this.querySQL('select * from shop_list where shopID = ?;', [Number(query.shopID)])
    if (res.length) {
        this.body = {
            code: '000',
            msg: '查找成功',
            data: res[0]
        }
    } else {
        this.body = {
            code: '111',
            msg: '无此店铺',
            data: {}
        }
    }
}