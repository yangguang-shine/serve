// this 指向 ctx

module.exports = async function find() {
    const query = this.request.body
    if (!query.shopID) {
        this.body = this.parameterError
        return
    }
    console.log()
    const res = await this.querySQL('select * from shop_list where shopID = ? and manageID = ?;', [Number(query.shopID), this.manageID])
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