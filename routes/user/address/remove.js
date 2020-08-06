// this 指向 this

module.exports = async function remove() {
    const { addressID } = this.request.body
    if (!addressID) {
        this.body = this.parameterError
        return
    }
    const userID = await this.getUserID()
    const sql = `delete from address_list_${userID} where addressID = ?`;
    await this.querySQL(sql, [addressID])
    this.body = {
        code: '000',
        msg: '删除成功',
        data: {}
    }
}