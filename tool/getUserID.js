module.exports = async(ctx) => {
    const token = ctx.cookies.get('token')
    const sql = `select userID from user_token_store where token = ?`
    const userIDList = await ctx.querySQL(sql, [token])
    let userID = ''
    if (userIDList.length) {
        userID = userIDList[0].userID
    } else {
        throw new Error('无userID')
    }
    return userID
}