// 以下 this 指向的是 ctx

module.exports = async function getManageID () {
    const manageToken = this.cookies.get('manageToken')
    const sql = `select manageID from manage_token_store where manageToken = ?`
    const manageIDList = await this.querySQL(sql, [manageToken])
    let manageID = ''
    if (manageIDList.length) {
        manageID = manageIDList[0].manageID
    } else {
        throw new Error('无manageID')
    }
    return manageID
}