const host = require('./host')
module.exports = {
    "button": [
        {
            "type": "view",
            "name": "首页",
            "url": `http://${host}/h5/pages/home/index?channel=20`
        },
        {
            "type": "view",
            "name": "订单",
            "url": `http://${host}/h5/pages/order/index?channel=20`
        },
        // {
        //     "type": "view",
        //     "name": "我的",
        //     "url": `http://${host}/h5/pages/center/index?channel=20`
        // },
        {
            "type": "view",
            "name": "编辑",
            "url": `http://${host}/h5/pages/manage/index?channel=20`
        },
    ]
}