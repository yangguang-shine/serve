const router = require("koa-router")();
const identification = require('../../model/wechats/identification')
const messageDelivery = require('../../model/wechats/messageDelivery')
router.prefix("/api/platform/wechat");

router.get("/check", async (ctx, next) => {
    identification(ctx)
});

router.post("/check", async (ctx, next) => {
    messageDelivery(ctx)
});

module.exports = router;
