module.exports = async(ctx) => {
    const userToken = ctx.cookies.get('userToken')
    const sql = `select userID from user_token_store where userToken = ?`
    const userIDList = await ctx.querySQL(sql, [userToken])
    let userID = ''
    if (userIDList.length) {
        userID = userIDList[0].userID
    } else {
        throw new Error('无userID')
    }
    return userID
}