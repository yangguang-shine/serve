module.exports = async(ctx) => {
    const manageToken = ctx.cookies.get('manageToken')
    const sql = `select manageID from manage_token_store where manageToken = ?`
    const manageIDList = await ctx.querySQL(sql, [manageToken])
    let manageID = ''
    if (manageIDList.length) {
        manageID = manageIDList[0].manageID
    } else {
        throw new Error('无manageID')
    }
    return manageID
}