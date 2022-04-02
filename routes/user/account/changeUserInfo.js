// this 指向 this


module.exports = async function changeUserInfo() {

    const { key, value } = this.request.body
    if (!(key && value)) {
        this.body = this.parameterError
        return
    }
    if (key === 'nickname') {
        const sql = `update pass_info_user set nickname = ? where userID = ?;`
        await this.querySQL(sql, [value, this.userID])
        this.body = {
            code: '000',
            msg: '修改成功',
            data: {}
        }
    } else {
        this.body = {
            code: '302',
            msg: '修改失败',
            data: {}
        }
    }
}
