// this 指向 ctx

const { unlink } = require('fs').promises;

module.exports = async function remove() {
    const { deleteShop = false, deleteFood = false, imgUrl } = this.request.body
    if (deleteShop) {
        await unlink(`./public${imgUrl}`)
    }
    if (deleteFood) {
        await unlink(`./public${imgUrl}`)
    }
    this.body = {
        code: '000',
        msg: '删除成功',
        data: {}
    }
}