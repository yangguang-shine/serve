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
        {
            "type": "view",
            "name": "编辑",
            "url": `http://${host}/h5/food/center/index?channel=20`
        },
    ]
}