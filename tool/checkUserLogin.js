module.exports = async (querySQL, token) => {
    try {
        const sql = `select token from my_token_store where token = ?`
        const tokenList = await querySQL(sql, token)
        if (tokenList.length) {
            return true
        }
        return false
    } catch (e) {
        console.log(e)
        return false
    }
}