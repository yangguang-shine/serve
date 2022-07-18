// this 指向 ctx

module.exports = async function edit() {
    const { shopID, shopName, imgUrl, startTime, endTime, address, description, businessTypes, minus, latitude, longitude, location, mainColor, deliverPrice, startDeliverPrice, mode } = this.request.body

    // shopName: values.shopName,
    // startTime: values.startTime.format("HH:mm"),
    // endTime: values.endTime.format("HH:mm"),
    // address: values.address,
    // description: values.description,
    // businessTypes: JSON.stringify(values.businessTypes),
    // minus: JSON.stringify(values.minusList || []),
    // shopName: values.shopName,
    // latitude,
    // longitude,
    // location: values.location,


    // this.body = this.parameterError

    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const sql = 'update shop_list set shopName = ?, imgUrl = ?, startTime = ?, endTime = ?, address = ?, description = ?, businessTypes = ?, minus = ?, latitude = ?, longitude = ?, location = ?, mainColor = ?, deliverPrice = ?, startDeliverPrice = ?, mode = ? where shopID = ? and manageID = ?;'
    const res = await this.querySQL(sql, [shopName, imgUrl, startTime, endTime, address, description, businessTypes, minus, latitude, longitude, location, mainColor, deliverPrice, startDeliverPrice, mode, shopID, this.manageID])
    this.body = {
        code: '000',
        msg: '更新成功',
        data: res
    }
}