module.exports = async (querySQL, manageToken) => {
    try {
        const sql = `select manageToken from manage_token_store where manageToken = ?`
        const tokenList = await querySQL(sql, manageToken)
        if (tokenList.length) {
            return true
        }
        return false
    } catch (e) {
        return false
    }
}