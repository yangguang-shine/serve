// this 指向 ctx

module.exports = async function find() {
    const query = this.query
    if (!query.shopID) {
        this.body = this.parameterError
        return
    }
    const res = await this.querySQL('select * from shop_list where shopID = ?;', [Number(query.shopID)])
    let data = {}
    if (res.length) {
        data = res[0]
        this.body = {
            code: '000',
            msg: '查找成功',
            data
        }
    } else {
        this.body = {
            code: '111',
            msg: '查找失败',
            data: null
        }
    }
}