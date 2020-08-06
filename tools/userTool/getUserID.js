// 以下 this 指向的是 ctx

module.exports = async function getUserID () {
    const userToken = this.cookies.get('userToken')
    const sql = `select userID from user_token_store where userToken = ?`
    const userIDList = await this.querySQL(sql, [userToken])
    let userID = ''
    if (userIDList.length) {
        userID = userIDList[0].userID
    } else {
        throw new Error('无userID')
    }
    return userID
}