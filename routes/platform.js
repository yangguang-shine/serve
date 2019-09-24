const router = require("koa-router")();
const identification = require('../model/wechats/identification')
const messageDelivery = require('../model/wechats/messageDelivery')
router.prefix("/platform/wechat");

router.get("/check", async (ctx, next) => {
    console.log(123)
    identification(ctx)
});

router.post("/check", async (ctx, next) => {
    console.log(111)
    messageDelivery(ctx)
});

module.exports = router;
