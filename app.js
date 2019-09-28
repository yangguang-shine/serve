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
const manage = require("./routes/manage");
const wechat = require("./routes/wechat");
const food = require("./routes/food");
const img = require("./routes/img");
const order = require("./routes/order");
const category = require("./routes/category");
const shop = require("./routes/shop");
const address = require("./routes/address");
const message = require("./routes/message");
const h5 = require("./routes/h5");
// const page = require("./routes/page");
const platform = require("./routes/platform");
const SQL = require('./model/mysql')
const checkUserLogin = require('./tool/checkUserLogin')
const getUserID = require('./tool/getUserID')
const auth = require('./model/wechats/auth')
const compress = require('koa-compress')
const { readFile } = require('./tool/fsPromise')

// const getAccessToken = require("./model/wechats").getAccessToken;
// getAccessToken();
// const setMenu = require("./model/wechats").setMenu;
// setMenu()
// error handler
onerror(app);

// 设置图片、css、js缓存
app.use(async (ctx, next) => {
    const reg = /\S*\.(jpe?g|png|js|svg)$/;
    console.log(1111111111111111)
    console.log(ctx.path)
    console.log(reg.test(ctx.path))
    if (reg.test(ctx.path)) {
        ctx.response.set('cache-control', `max-age=${60 * 60}`)
    }
    await next()
})

app.context.querySQL = SQL.querySQL
app.context.getUserID = getUserID
app.context.parameterError = {
    code: '222',
    msg: '参数校验失败',
    data: {}
}
app.context.SQLtransaction = SQL.SQLtransaction
app.context.checkUserLogin = checkUserLogin

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
app.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))
// logger
app.use(async (ctx, next) => {
    ctx.compress = true
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 判断公众号是否授权
app.use(async (ctx, next) => {
    // channel    10: 小程序   20: 公众号
    const { channel } = ctx.query
    console.log(ctx.path)
    console.log(channel)
    const ignorePath = ['/wechat/wx/login', '/platform/wechat/check']
    const find = ignorePath.find(item => item === ctx.path)
    if (find) {
        await next()
    } else {
         // 小程序登录
        const token = ctx.cookies.get('token')
        if (Number(channel) === 10) {
            if (token) {
                const loginStatus = await checkUserLogin(ctx.querySQL, token)
                if (!loginStatus) {
                    ctx.body = {
                        code: '555',
                        msg: '凭证过期请登录',
                        data: null
                    }
                } else {
                    await next()
                }
            } else {
                ctx.body = {
                    code: '555',
                    msg: '请登录',
                    data: null
                }
            }
        } else if (Number(channel) === 20) {
            // 公众号登录
            if (token) {
                const status = await ctx.checkUserLogin(ctx.querySQL, token)
                if (status) {
                    await next()
                } else {
                    if (!ctx.path.startsWith('/h5/pages')) {
                        ctx.body = {
                            code: '666',
                            msg: '无token',
                            data: null
                        }
                        return
                    }
                    await auth(ctx)
                }
            } else {
                if (!ctx.path.startsWith('/h5/pages')) {
                    ctx.body = {
                        code: '666',
                        msg: '无token',
                        data: null
                    }
                    return
                }
                await auth(ctx)
            }
        } else {
            console.log('不支持该渠道')
            await next()
        }
    }
});

app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/h5/pages')) {
        const data = await readFile('F:/my-uni-app/unpackage/dist/build/h5/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    } else if (ctx.path.startsWith('/h5/static')) {
        const data = await readFile(`F:/my-uni-app/unpackage/dist/build${ctx.path}`)
        ctx.body = data
        return
    }
    await next()
});
// app.use(async (ctx, next) => {
//     if (ctx.path.startsWith('/h5/pages')) {
//         const data = await readFile('./public/h5/index.html')
//         ctx.type = 'text/html;charset=utf-8';
//         ctx.body = data
//         return
//     }
//     await next()
// });
// 判断是否需要登录
// app.use(async (ctx, next) => {
//     console.log(ctx.path)
//     if (ctx.path === '/wechat/wx/login' || ctx.path === '/h5/user/check' || ctx.path === '/user/platform' || ctx.path.startsWith('/h5')) {
//         await next()
//     } else {
//         const token = ctx.cookies.get('token')
//         if (token) {
//             const loginStatus = await checkUserLogin(ctx.querySQL, token)
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
// app.use(page.routes(), page.allowedMethods());
app.use(message.routes(), message.allowedMethods());
app.use(platform.routes(), platform.allowedMethods());
app.use(manage.routes(), manage.allowedMethods());

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
