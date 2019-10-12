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
const entertainment = require("./routes/entertainment");
// const page = require("./routes/page");
const platform = require("./routes/platform");
const SQL = require('./model/mysql')
const checkUserLogin = require('./tool/checkUserLogin')
const getUserID = require('./tool/getUserID')
const getManageID = require('./tool/getManageID')
const checkManageLogin = require('./tool/checkManageLogin')
// const auth = require('./model/wechats/auth')
const compress = require('koa-compress')
const { readFile } = require('./tool/fsPromise')
const checkManageLoginInterface = require('./utils/checkManageLoginInterface')
const checkUserLoginInterface = require('./utils/checkUserLoginInterface')
const ignoreCheckLogin = require('./utils/ignoreCheckLoginList')

// const getAccessToken = require("./model/wechats").getAccessToken;
// getAccessToken();
// const setMenu = require("./model/wechats").setMenu;
// setMenu()
// error handler
onerror(app);

// 设置图片、css、js缓存
app.use(async (ctx, next) => {
    const reg = /\S*\.(jpe?g|png|js|svg|css|html)$/;
    console.log('ctx.path')
    console.log(ctx.path)
    if (reg.test(ctx.path)) {
        ctx.response.set('cache-control', `max-age=${60 * 60 * 24 * 7}`)
    }
    await next()
})

app.context.querySQL = SQL.querySQL
app.context.getUserID = getUserID
app.context.getManageID = getManageID
app.context.checkManageLogin = checkManageLogin
app.context.parameterError = {
    code: '222',
    msg: '参数校验失败',
    data: {}
}
app.context.SQLtransaction = SQL.SQLtransaction
app.context.checkUserLogin = checkUserLogin

app.use(xmlParser());
app.use(
    bodyparser()
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

// 判断用户token权限
app.use(checkUserLoginInterface())

// 判断管理员manageToken权限
app.use(checkManageLoginInterface())

// 用户token权限和manageToken权限判断
app.use(ignoreCheckLogin())

app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/h5/pages')) {
        const data = await readFile('./public/h5/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    }
    await next()
});
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
app.use(entertainment.routes(), entertainment.allowedMethods());

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

// 000     成功
// 111     查找错误

// 555     登录过期
// 666     请登录
// 777     管理凭证过期
// 888     管理员登录
