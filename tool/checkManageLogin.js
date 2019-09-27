module.exports = async (querySQL, token) => {
    const sql = `select token from my_token_store where token = ?`
    const tokenList = await querySQL(sql, token)
    if (tokenList.length) {
        return true
    }
    return false
}