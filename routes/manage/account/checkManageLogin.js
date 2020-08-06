
module.exports = async function checkManageLogin() {
    const manageToken = this.cookies.get('manageToken')
    const status = await this.checkManageLogin(manageToken)
    if (status) {
        this.body = {
            code: '000',
            msg: '成功',
            data: true
        }
    } else {
        this.body = {
            code: '888',
            msg: '管理登录过期',
            data: false
        }
    }
}