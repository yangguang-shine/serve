// this 指向 this


module.exports = async function getUserInfo() {
    const sql = ` select nickname, headimgurl, phone from pass_info_user where userID = ?;`
    const userInfoList = await this.querySQL(sql, [this.userID])
    if (userInfoList.length) {
        const originUserInfo = userInfoList[0]
        const userInfo = {
            ...originUserInfo,
            phone: handlePhone(originUserInfo.phone)
        }
        this.body = {
            code: '000',
            msg: '查询成功',
            data: userInfo
        }
    } else {
        this.body = {
            code: '301',
            msg: '查询失败',
            data: {}
        }
    }
}
function handlePhone(phone) {
    try {
        const phoneStr = `${phone}`
        return `${phoneStr.slice(0, 3)}***${phoneStr.slice(-4)}`
    } catch (error) {
        return '***'

    }
}