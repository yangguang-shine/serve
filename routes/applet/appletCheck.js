const router = require("koa-router")();
const identification = require('../../model/appletInfo/identification')
const messageDelivery = require('../../model/appletInfo/messageDelivery')
router.prefix("/applet/wechat");

router.get("/check", async (ctx, next) => {
    identification(ctx)
});

router.post("/check", async (ctx, next) => {
    console.log('收到用户信息')
    messageDelivery(ctx)
});

module.exports = router;
