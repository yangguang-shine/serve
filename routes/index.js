const router = require("koa-router")();
// const auth = require("../model/wechats/auth");
const UserInfo = require('../model/mongodb/index').UserInfo
const auth = require("../model/wechats/auth");

router.get("/index", async (ctx, next) => {
    // await ctx.render('index', {
    //   title: 'Hello Koa 2!'
    // })
// const authResult = await auth(ctx);
    // if (authResult === "false") return;
    console.log('openid:' + ctx.session.openid)
    let authStatus = false
    if (ctx.session.openid) {
        authStatus = true
    } else {
        console.log('去授权')
        authStatus = await auth(ctx)
    }
    if (!authStatus) {
        return
    }
    console.log('去首页')
    console.log(ctx.session.openid)
    const user = await ctx.findOne(UserInfo, { openid: ctx.session.openid })
    await ctx.render("index.ejs", user);
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
