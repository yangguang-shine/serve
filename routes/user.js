const router = require("koa-router")();
router.prefix("/user/h5");

router.post("/login", async (ctx, next) => {
    const { username, password } = ctx.request.body
});

router.post("/register", async (ctx, next) => {
    const { username, password } = ctx.request.body
});

router.post("/changePassword", async (ctx, next) => {
    const { username, password, nowPassword } = ctx.request.body
});

module.exports = router;