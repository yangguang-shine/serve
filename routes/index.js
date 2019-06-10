const router = require("koa-router")();
// const auth = require("../model/wechats/auth");
const WechatUser = require('../model/mongodb/WechatUser')
const auth = require("../model/wechats/auth");
const host = require("../model/wechats/host");

router.get("/index", async (ctx, next) => {
    // await ctx.render('index', {
    //   title: 'Hello Koa 2!'
    // })
// const authResult = await auth(ctx);
    // if (authResult === "false") return;
    console.log('openid:' + ctx.session.openid)
    let user = null
    if (!ctx.session.openid) {
        console.log('去授权')
        user = await auth(ctx)
        if (user) {
            await ctx.render("index.ejs", user);
        }
    } else {
        console.log('去首页')
        console.log(ctx.session.openid)
        user = await ctx.findOne(WechatUser, { openid: ctx.session.openid })
        console.log('user:' + user)
        if (user) await ctx.render("index.ejs", user);
        else {
            console.log(123)
            ctx.session.openid = ''
            ctx.redirect(`http://${host}/index`)
        }
    }
});
module.exports = router;
