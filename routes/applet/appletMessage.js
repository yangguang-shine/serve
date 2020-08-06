const router = require('koa-router')()
const httpsGet = require('../../tools/httpsGet')
const dataFormat = require('../../tools/dataFormat')
const identification = require('../../model/wechats/identification')
const messageDelivery = require('../../model/wechats/messageDelivery')
// const mysqlConfig = require('../config/session-config')
// const MysqlStore = require('koa2-session-mysql')

router.prefix('/')

router.post('/index', async function (ctx, next) {
    messageDelivery(ctx)
})
router.post('/login', async function (ctx, next) {
})
module.exports = router
