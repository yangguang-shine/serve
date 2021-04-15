// this 指向 ctx
const { deleteShopImg, deleteFoodImg } = require('../_manageCommonTool')

module.exports = async function remove() {
    const { shopID } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const shopImgUrlList = await this.querySQL(`select imgUrl from shop_list where shopID = ?`, [shopID])
    const foodImgUrlList = await this.querySQL(`select imgUrl from shop_food_info where shopID = ?`, [shopID])
    await this.SQLtransaction(async (querySQL) => {
        const sql1 = `delete from shop_list where shopID = ?`;
        const sql2 = `delete from shop_category_list where shopID = ?`;
        const sql3 = `delete from shop_food_info  where shopID = ?`;
        const promise1 = querySQL(sql1, [shopID])
        const promise2 = querySQL(sql2, [shopID])
        const promise3 = querySQL(sql3, [shopID])
        await promise1
        await promise2
        await promise3
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