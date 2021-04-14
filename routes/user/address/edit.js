// this 指向 this

module.exports = async function edit() {
    const { name, sex, mobile, address1, address2, addressID } = this.request.body
        if (!addressID) {
            this.body = this.parameterError
            return
        }
        await this.SQLtransaction(async(querySQL) => {
            const userID = await this.getUserID()
            const sql = `update user_address_list set name = ?, sex = ?, mobile = ?, address1 = ?, address2 = ? where addressID = ? and userID = ?;`
            await querySQL(sql, [name, sex, mobile, address1, address2, addressID, userID])
            // await addressExchange({ querySQL, userID, addressID })
        })
        this.body = {
            code: '000',
            msg: '更新成功',
            data: null
        }
}