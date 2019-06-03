const router = require("koa-router")();
const auth = require("./wechats/auth");

router.get("/index", async (ctx, next) => {
    // await ctx.render('index', {
    //   title: 'Hello Koa 2!'
    // })
const authResult = await auth(ctx);
    if (authResult === "false") return;
    await ctx.render("index.ejs", authResult);
});

router.get("/string", async (ctx, next) => {
    ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
    ctx.body = {
        title: "koa2 json"
    };
});

module.exports = router;
