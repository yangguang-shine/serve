// this 指向 this

module.exports = async function add() {
    const { name, sex, mobile, address1, address2 } = this.request.body
    const userID = await this.getUserID()
    const sql = `insert into address_list_${userID} (name, sex, mobile, address1, address2) values (?)`;
    const res = await this.querySQL(sql, [[name, sex, mobile, address1, address2]])
    const addressID = res.insertId
    await addressExchange({ querySQL: this.querySQL, userID, addressID })
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}

async function addressExchange({ querySQL, userID, addressID } = {}) {
    const sql1 = `select * from address_list_${userID} where addressID = ?`
    const sql2 = `select * from address_list_${userID} limit 1`
    const findAddressPrimise = querySQL(sql1, [addressID])
    const firstAddressPrimise = querySQL(sql2, [addressID])
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
    const sql3 = `update address_list_${userID} set name = ?, sex = ?, mobile = ?, address1 = ?, address2 = ? where addressID = ?;`
    const promise1 = querySQL(sql3, [name, sex, mobile, address1, address2, firstAddress.addressID]);
    ({ name, sex, mobile, address1, address2 } = firstAddress);
    const promise2 = querySQL(sql3, [name, sex, mobile, address1, address2, findAddress.addressID]);
    await promise1
    await promise2
}