const { logger } = require("../../../utils/logger")

module.exports = async function list() {
    logger.info(this.path, this.userID)
    const { businessType } = this.request.body
    let res = []
    if (businessType) {
        const sql = `select * from shop_list where businessTypes like '%${businessType}%'`
        res = await this.querySQL(sql, [])
    } else {
        const sql = 'select * from shop_list'
        res = await this.querySQL(sql, [])
    }
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}