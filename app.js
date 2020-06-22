const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
// const bodyparser = require("koa-bodyparser");
const koaBody = require("koa-body");
const xmlParser = require("koa-xml-body");
const logger = require("koa-logger");
const compress = require('koa-compress')

// 用户登录注册
const userLoginRegister = require("./routes/loginRegister/userLoginRegister");

// 管理员登录注册
const manageLoginRegister = require("./routes/loginRegister/manageLoginRegister");

// 管理员店铺
const manageShop = require("./routes/manage/shop");

// 管理员店铺订单
const manageOrder = require("./routes/manage/order");

// 管理员菜品分类
const manageCategory = require("./routes/manage/category");

// 管理员菜品详情
const manageFood = require("./routes/manage/food");

// 用户地址
const userAddress = require("./routes/user/address");

// 用户查看店铺列表
const userShop = require("./routes/user/shop");

// 用户订单
const userOrder = require("./routes/user/order");

// 图片上传
const img = require("./routes/manage/img");



// 添加路由  用户
const entertainment = require("./routes/user/entertainment");
// const userOrder = require("./routes/user/userOrder");
// const userShop = require("./routes/user/userShop");
const wechat = require("./routes/user/wechat");

// 添加路由  管理员
// const category = require("./routes/manage/category");
// const food = require("./routes/manage/food");
// const manageShop = require("./routes/manage/manageShop");

// 添加路由  公众平台
const platformMessage = require("./routes/platform/platformMessage");
const platformCheck = require("./routes/platform/platformCheck");

// 添加路由  小程序客服
const appletMessage = require("./routes/applet/appletMessage");
const appletCheck = require("./routes/applet/appletCheck");

// 引入方法
const SQL = require('./model/mysql')
const dataFormat = require('./tool/dataFormat')
const checkUserLogin = require('./tool/checkUserLogin')
const getUserID = require('./tool/getUserID')
const getManageID = require('./tool/getManageID')
const checkManageLogin = require('./tool/checkManageLogin')
// const auth = require('./model/wechats/auth')
const { readFile } = require('./tool/fsPromise')
const checkManageLoginInterface = require('./utils/checkManageLoginInterface')
const checkUserLoginInterface = require('./utils/checkUserLoginInterface')

// const getAppletAccessToken = require("./model/appletInfo").getAppletAccessToken;
// getAppletAccessToken();

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
app.context.dataFormat = dataFormat
app.context.getUserID = getUserID
app.context.getManageID = getManageID
app.context.checkManageLogin = checkManageLogin
app.context.checkUserLogin = checkUserLogin
app.context.parameterError = {
    code: '300',
    msg: '参数校验失败',
    data: {}
}
app.context.SQLtransaction = SQL.SQLtransaction

app.use(xmlParser());
// app.use(
//     bodyparser()
// );
app.use(
    koaBody()
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
// 判断是否是登录
app.use(userLoginRegister.routes(), userLoginRegister.allowedMethods());
app.use(manageLoginRegister.routes(), manageLoginRegister.allowedMethods());


// 判断用户token权限
// app.use(checkUserLoginInterface())

// 判断管理员manageToken权限
// app.use(checkManageLoginInterface())

// 用户token权限和manageToken权限判断
// app.use(ignoreCheckLogin())

app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/user/pages')) {
        const data = await readFile('./public/user/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    } else if (ctx.path.startsWith('/manage/pages')) {
        const data = await readFile('./public/manage/index.html')
        ctx.type = 'text/html;charset=utf-8';
        ctx.body = data
        return
    }
    await next()
});
// routes
// 管理员routes
app.use(manageOrder.routes(), manageOrder.allowedMethods());
app.use(manageShop.routes(), manageShop.allowedMethods());
app.use(manageCategory.routes(), manageCategory.allowedMethods());
app.use(manageFood.routes(), manageFood.allowedMethods());

// 用户routes

app.use(userAddress.routes(), userAddress.allowedMethods());
app.use(userOrder.routes(), userOrder.allowedMethods());
app.use(userShop.routes(), userShop.allowedMethods());


// 其他
app.use(entertainment.routes(), entertainment.allowedMethods());
app.use(wechat.routes(), wechat.allowedMethods());

app.use(img.routes(), img.allowedMethods());


app.use(platformMessage.routes(), platformMessage.allowedMethods());
app.use(platformCheck.routes(), platformCheck.allowedMethods());
app.use(appletMessage.routes(), appletMessage.allowedMethods());
app.use(appletCheck.routes(), appletCheck.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
    ctx.body = {
        code: '999',
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
