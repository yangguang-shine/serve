// 以下 this 指向的是 ctx

module.exports = async function checkUserLogin (token) {
    try {
        const sql = `select token from token_store_user where token = ?`
        const tokenList = await this.querySQL(sql, [token])
        if (tokenList.length) {
            return true
        }
        return false
    } catch (e) {
        console.log(e)
        return false
    }
}