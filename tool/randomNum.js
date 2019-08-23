const randomNum = (timeSlice = 0, endNumSlice = 6) => {
    const timestamp = `${+new Date()}`.slice(timeSlice)
    const endNum = `${Math.random()}`.slice(2, 6)
    return Number(timestamp + endNum)
}
// 订单号 orderKey 0 6
module.exports = randomNum