const router = require('koa-router')()
const identification = require('./wechats/identification')
const messageDelivery = require('./wechats/messageDelivery')

router.prefix('/wechat')

router.get('/', function (ctx, next) {
    identification(ctx)
})
router.post('/', function (ctx, next) {
    messageDelivery(ctx)
})

module.exports = router
