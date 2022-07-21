const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const koaBody = require("koa-body");
const xmlParser = require("koa-xml-body");
// const logger = require("koa-logger");
const compress = require('koa-compress')
const { accessLogger, logger } = require('./utils/logger');


// 用户登录注册
const userAccount = require("./routes/user/account");

// 管理员登录注册
const manageAccount = require("./routes/manage/account");

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
const manageUploadImg = require("./routes/manage/uploadImg");

// 添加路由  用户
const entertainment = require("./routes/user/entertainment");
const wechatApplet = require("./routes/wechat/applet");

// 路由404
const { checkLogin, handleStatus404, webH5HTML } = require('./middleware')
// const status405 = require('./routes/status')
// 添加路由  公众平台  TODO
// const platformMessage = require("./routes/platform/platformMessage");
// const platformCheck = require("./routes/platform/platformCheck");

// 添加路由  小程序客服  TODO
// const appletMessage = require("./routes/applet/appletMessage");
// const appletCheck = require("./routes/applet/appletCheck");

// 引入方法
// SQL 普通查询 和 事务查询
const { querySQL, SQLtransaction } = require('./model/mysql')

// 流数据的获取
const dataFormat = require('./tools/dataFormat')
// 简单路由 try catch 处理的方法
const simpleRouterTryCatchHandle = require('./tools/simpleRouterTryCatchHandle');
const managePcHTML = require("./middleware/managePcHTML");
// const auth = require('./model/wechats/auth')
// const checkManageLoginInterface = require('./utils/checkManageLoginInterface')
// const checkUserLoginInterface = require('./utils/checkUserLoginInterface')

// 微信公众号
// const getAppletAccessToken = require("./model/appletInfo").getAppletAccessToken;
// getAppletAccessToken();
// const getAccessToken = require("./model/wechats").getAccessToken;
// getAccessToken();
// const setMenu = require("./model/wechats").setMenu;
// setMenu()

// error handler
onerror(app);


app.use(accessLogger)


// 设置图片、css、js缓存
app.use(async (ctx, next) => {
    const reg = /\S*\.(jpe?g|png|js|svg|css|ico)$/;
    if (reg.test(ctx.path)) {
        ctx.response.set('cache-control', `max-age=${60 * 60 * 24 * 700}`)
    }
    await next()
})

// 向 ctx 绑定一些方法方法
app.context.querySQL = querySQL
app.context.SQLtransaction = SQLtransaction
app.context.dataFormat = dataFormat
app.context.simpleRouterTryCatchHandle = simpleRouterTryCatchHandle
// 参数校验失败返回对象
app.context.parameterError = {
    code: '300',
    msg: '参数校验失败',
    data: {}
}

// xml 中间件
app.use(xmlParser());

app.use(
    koaBody({
        multipart: true,
    })
);

// json 中间件
app.use(json());

// logger 日志中间件
// app.use(logger());

// 静态资源中间件
app.use(require("koa-static")(__dirname + "/public"));

// 使用模板引擎
app.use(
    views(__dirname + "/views", {
        extension: "ejs"
    })
);

// session key
app.keys = ['yangguang'];

// 压缩中间件
app.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

// logger
// app.use(async (ctx, next) => {
//     ctx.compress = true
//     const start = new Date();
//     await next();
//     const ms = new Date() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

app.use(webH5HTML)
app.use(managePcHTML)
app.use(checkLogin)
// 判断用户token权限
// app.use(checkUserLoginInterface())

// 判断管理员manageToken权限
// app.use(checkManageLoginInterface())

// 用户token权限和manageToken权限判断
// app.use(ignoreCheckLogin())

// app.use(async (ctx, next) => {
//     if (ctx.path.startsWith('/user/pages')) {
//         const data = await readFile('./public/user/index.html')
//         ctx.type = 'text/html;charset=utf-8';
//         ctx.body = data
//         return
//     } else if (ctx.path.startsWith('/manage/pages')) {
//         const data = await readFile('./public/manage/index.html')
//         ctx.type = 'text/html;charset=utf-8';
//         ctx.body = data
//         return
//     }
//     await next()
// });
// routes

// 用户和管理员登录注册组件
app.use(userAccount.routes(), userAccount.allowedMethods());
app.use(manageAccount.routes(), manageAccount.allowedMethods());

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
app.use(manageUploadImg.routes(), manageUploadImg.allowedMethods());
app.use(entertainment.routes(), entertainment.allowedMethods());
app.use(wechatApplet.routes(), wechatApplet.allowedMethods());
// app.use(platformMessage.routes(), platformMessage.allowedMethods());
// app.use(platformCheck.routes(), platformCheck.allowedMethods());
// app.use(appletMessage.routes(), appletMessage.allowedMethods());
// app.use(appletCheck.routes(), appletCheck.allowedMethods());

// app.use(status405.routes(), status405.allowedMethods());

// 404 判断


app.use(handleStatus404)

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
