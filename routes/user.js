const router = require("koa-router")();
const register = require('../model/user/register')
const identification = require('../model/wechats/identification')
const messageDelivery = require('../model/wechats/messageDelivery')
router.prefix("/user/platform");

router.get("/", async (ctx, next) => {
    console.log(123)
    identification(ctx)
});

router.post("/", async (ctx, next) => {
    console.log(111)
    messageDelivery(ctx)
});

router.get("/register", async (ctx, next) => {
    await ctx.render("register", {});
});

router.post("/register", async (ctx, next) => {
    await register(ctx)
});

module.exports = router;
