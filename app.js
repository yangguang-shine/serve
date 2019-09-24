const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const xmlParser = require("koa-xml-body");
const logger = require("koa-logger");

const index = require("./routes/index");
const user = require("./routes/platform");
const wechat = require("./routes/wechat");
const food = require("./routes/food");
const img = require("./routes/img");
const order = require("./routes/order");
const category = require("./routes/category");
const shop = require("./routes/shop");
const address = require("./routes/address");
const message = require("./routes/message");
const h5 = require("./routes/h5");
const page = require("./routes/page");
const platform = require("./routes/platform");
const SQL = require('./model/mysql')
const checkLogin = require('./tool/checkLogin')
const getUserID = require('./tool/getUserID')
const { readFile } = require('./tool/fsPromise')
const auth = require('./model/wechats/auth')

// const getAccessToken = require("./model/wechats").getAccessToken;
// getAccessToken();
// const setMenu = require("./model/wechats").setMenu;
// setMenu()
// error handler
onerror(app);
app.context.querySQL = SQL.querySQL
app.context.getUserID = getUserID
app.context.SQLtransaction = SQL.SQLtransaction
app.context.checkLogin = checkLogin
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

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 判断公众号是否授权
app.use(async (ctx, next) => {
    // const { notNeedLogin } = ctx.query
    const ignorePath = ['/wechat/wx/login', '/platform/wechat/check']
    const find = ignorePath.find(item => item === ctx.path)
    if (find) {
        await next()
    } else {
        const token = ctx.cookies.get('token')
        console.log(111111)
        console.log(token)
        if (token) {
            const status = await ctx.checkLogin(token)
            console.log('status')
            console.log(status)
            if (status) {
                await next()
            } else {
                await auth(ctx)
            }
        } else {
            await auth(ctx)
        }
    }
});
app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/pages')) {
        const data = await readFile('./public/h5/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    }
    await next()
});
// 判断是否需要登录
// app.use(async (ctx, next) => {
//     console.log(ctx.path)
//     if (ctx.path === '/wechat/wx/login' || ctx.path === '/h5/user/check' || ctx.path === '/user/platform' || ctx.path.startsWith('/h5')) {
//         await next()
//     } else {
//         const token = ctx.cookies.get('token')
//         if (token) {
//             const loginStatus = await checkLogin(ctx.querySQL, token)
//             if (!loginStatus) {
//                 ctx.body = {
//                     code: '555',
//                     msg: '凭证过期请登录',
//                     data: null
//                 }
//             }
//         } else {
//             ctx.body = {
//                 code: '555',
//                 msg: '请登录',
//                 data: null
//             }
//         }
//         if (ctx.method === 'POST') {
//             const { shopID } = ctx.request.body;
//             if (`${shopID}` === '100055') {
//                 const userID = await ctx.getUserID(ctx);
//                 console.log(userID)
//                 if (`${userID}` !== '100000007') {
//                     ctx.body = {
//                         code: '999',
//                         msg: '该店铺只有开发者可修改',
//                         data: null
//                     }
//                 }
//             }
//         }
//     }
// });

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
app.use(shop.routes(), shop.allowedMethods());
app.use(address.routes(), address.allowedMethods());
app.use(h5.routes(), h5.allowedMethods());
app.use(page.routes(), page.allowedMethods());
app.use(message.routes(), message.allowedMethods());
app.use(platform.routes(), platform.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
    ctx.body = {
        code: '111',
        msg: '服务错误',
        data: null
    }
});

module.exports = app;
