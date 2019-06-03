const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const xmlParser = require("koa-xml-body");
const logger = require("koa-logger");

const index = require("./routes/index");
const users = require("./routes/users");
const wechat = require("./routes/wechat");

// const getAccessToken = require("./routes/wechats").getAccessToken;
// getAccessToken();
// const setMenu = require("./routes/wechats").setMenu;
// setMenu()
// error handler
onerror(app);

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

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(wechat.routes(), wechat.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});

module.exports = app;
