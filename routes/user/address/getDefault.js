
module.exports = async function getDefault() {
    const res = await this.querySQL(`select * from user_address_list where userID = ? limit 1;`, [this.userID])
    let data = {}
    if (res.length) {
        data = res[0]
    }
    this.body = {
        code: '000',
        msg: '查找成功',
        data
    }
}