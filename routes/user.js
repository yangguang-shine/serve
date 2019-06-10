const router = require("koa-router")();
const login = require('../model/user/login')
const register = require('../model/user/register')
router.prefix("/user");

router.get("/login", async (ctx, next) => {
    await ctx.render("login", {});
});

router.post("/login", async (ctx, next) => {
    await login(ctx)
    console.log(111)
});

router.get("/register", async (ctx, next) => {
    await ctx.render("register", {});
});

router.post("/register", async (ctx, next) => {
    await register(ctx)
});

module.exports = router;
