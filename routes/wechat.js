const router = require('koa-router')()
const identification = require('../model/wechats/identification')
const messageDelivery = require('../model/wechats/messageDelivery')

router.prefix('/wechat')

router.get('/', function (ctx, next) {
    identification(ctx)
})
router.post('/', function (ctx, next) {
    messageDelivery(ctx)
})

module.exports = router
