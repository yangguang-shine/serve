const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const xmlParser = require("koa-xml-body");
const logger = require("koa-logger");

const index = require("./routes/index");
const user = require("./routes/user");
const wechat = require("./routes/wechat");
const food = require("./routes/food");
const img = require("./routes/img");
const order = require("./routes/order");
const category = require("./routes/category");
const session = require('koa-session');
const querySQL = require('./model/mysql')
// const findOne = require('./model/mongodb').findOne;
// const saveOne = require('./model/mongodb').saveOne;
// require('./model/mongodb').connect();

// const getAccessToken = require("./model/wechats").getAccessToken;
// getAccessToken();
// const setMenu = require("./model/wechats").setMenu;
// setMenu()
// error handler
onerror(app);
// app.context.findOne = findOne
// app.context.saveOne = saveOne
app.context.querySQL = querySQL
app.use(xmlParser());
app.use(
    bodyparser({
        enableTypes: ["json", "form", "text"]
    })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
    views(__dirname + "/views", {
        extension: "ejs"
    })
);
app.keys = ['yangguang'];
const CONFIG = {
   key: 'yg', // cookie key (default is koa:sess)
   maxAge: 86400000, //  cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true, // 是否可以overwrite    (默认default true)
   httpOnly: true, // cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true, // 签名默认true
   rolling: false, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false // (boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app))//
// logger

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
// app.use(async (ctx, next) => {
//     console.log('openid:' + ctx.session.openid)
//     if (!ctx.session.openid) {
//         console.log('去授权')
//         await auth(ctx)
//     } else {
//         await next();
//     }
// });
// routes
app.use(index.routes(), index.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(wechat.routes(), wechat.allowedMethods());
app.use(food.routes(), food.allowedMethods());
app.use(img.routes(), img.allowedMethods());
app.use(category.routes(), category.allowedMethods());
app.use(order.routes(), order.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});

module.exports = app;
