// 以下 this 指向的是 ctx

module.exports = async function checkManageLogin (manageToken) {
    try {
        const sql = `select manageToken from token_store_manage where manageToken = ?`
        const tokenList = await this.querySQL(sql, [manageToken])
        if (tokenList.length) {
            return true
        }
        return false
    } catch (e) {
        return false
    }
}