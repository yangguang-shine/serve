// this 指向 this

module.exports = async function add() {
    await this.SQLtransaction(async (querySQL) => {
        const { name, sex, mobile, address1, address2 } = this.request.body
        const userID = await this.getUserID()
        const sql = `insert into user_address_list (name, sex, mobile, address1, address2, userID) values (?)`;
        const res = await querySQL(sql, [[name, sex, mobile, address1, address2, userID]])
        const addressID = res.insertId
        await addressExchange({ querySQL, userID, addressID })
    })
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}

async function addressExchange({ querySQL, userID, addressID } = {}) {
    const sql1 = `select * from user_address_list where addressID = ? and userID = ?`
    const sql2 = `select * from user_address_list where userID = ? limit 1`
    const findAddressPrimise = querySQL(sql1, [addressID, userID])
    const firstAddressPrimise = querySQL(sql2, [userID])
    let findAddress = await findAddressPrimise
    let firstAddress = await firstAddressPrimise
    if(!findAddress.length || !firstAddress.length) {
        throw Error('换位查找出错了')
    }
    if(findAddress.length) {
        findAddress = findAddress[0]
    }
    if (firstAddress.length) {
        firstAddress = firstAddress[0]
    }
    if (findAddress.addressID === firstAddress.addressID) {
        return
    }
    let { name, sex, mobile, address1, address2 } = findAddress
    const sql3 = `update user_address_list set name = ?, sex = ?, mobile = ?, address1 = ?, address2 = ? where addressID = ? and userID = ?;`
    const promise1 = querySQL(sql3, [name, sex, mobile, address1, address2, firstAddress.addressID, userID]);
    ({ name, sex, mobile, address1, address2 } = firstAddress);
    const promise2 = querySQL(sql3, [name, sex, mobile, address1, address2, findAddress.addressID, userID]);
    await promise1
    await promise2
}