// this 指向 this

async function addressExchange({ querySQL, userID, addressID } = {}) {
    const sql1 = `select * from user_address_list where addressID = ? and userID = ?;`
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

module.exports = async function setDefault() {
   

    await this.SQLtransaction(async (querySQL) => {
        const { addressID } = this.request.body
        console.log('addressID')
        console.log(addressID)
        if (!addressID) {
            this.body = this.parameterError
            return
        }
        await addressExchange({ querySQL, userID: this.userID, addressID })
    })


    this.body = {
        code: '000',
        msg: '查找成功',
        data: null
    }
}