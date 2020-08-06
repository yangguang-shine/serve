// this 指向 ctx
const { deleteShopImg, deleteFoodImg } = require('../_manageCommonTool')

module.exports = async function add() {
    const { shopID } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const shopImgUrlList = await this.querySQL(`select imgUrl from shop_list where shopID = ?`, [shopID])
    const foodImgUrlList = await this.querySQL(`select imgUrl from food_info_${shopID}`, [])
    await this.SQLtransaction(async (querySQL) => {
        const sql1 = `delete from shop_list where shopID = ?`;
        const sql2 = `drop table if exists category_list_${shopID};`;
        const sql3 = `drop table if exists food_info_${shopID};`;
        const sql4 = `drop table if exists order_food_list_${shopID};`;
        const sql5 = `drop table if exists order_key_list_${shopID};`;
        const promise1 = querySQL(sql1, [shopID])
        const promise2 = querySQL(sql2, [shopID])
        const promise3 = querySQL(sql3, [shopID])
        const promise4 = querySQL(sql4, [shopID])
        const promise5 = querySQL(sql5, [shopID])
        await promise1
        await promise2
        await promise3
        await promise4
        await promise5
    })
    deleteAllImg(shopImgUrlList, foodImgUrlList)
    this.body = {
        code: '000',
        msg: '删除成功',
        data: {}
    }
}

const deleteAllImg = async (shopImgUrlList, foodImgUrlList) => {
        // 删除图片
        try {
            let deleteShopImgPromise = null
            if (shopImgUrlList.length) {
                if (shopImgUrlList[0].imgUrl) {
                    deleteShopImgPromise = deleteShopImg(`./public${shopImgUrlList[0].imgUrl}`)
                }
            }
            const promiseList = []
            foodImgUrlList.forEach((foodImgItem) => {
                if (foodImgItem.imgUrl) {
                    promiseList.push(deleteFoodImg(`./public${foodImgItem.imgUrl}`))
                }
            })
            await deleteShopImgPromise
            for (let i = 0; i < promiseList.length; i += 1) {
                await promiseList[i]
            }
        } catch(e) {
            console.log(e)
        }
}