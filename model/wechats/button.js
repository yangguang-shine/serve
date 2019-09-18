const host = require('./host')
module.exports = {
    "button": [
        {
            "type": "view",
            "name": "首页",
            "url": `http://${host}/pages/home/index`
        },
        {
            "type": "view",
            "name": "订单",
            "url": `http://${host}/pages/order/index`
        },
        {
            "type": "view",
            "name": "编辑",
            "url": `http://${host}/food/center/index`
        },
    ]
}