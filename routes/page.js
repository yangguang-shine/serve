const router = require("koa-router")();
const { readFile } = require('../tool/fsPromise')

router.prefix("/h5/page");

router.get("/home/main", async (ctx, next) => {
    console.log(123)
    const data = await readFile('./public/h5/index.html')
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = data
    console.log(data)
});
// router.get("/home", async (ctx, next) => {
//     const data = await readFile('./public/h5/index.html')
//     ctx.type = 'text/html;charset=utf-8';
//     ctx.body = data
// });

// router.post("/", async (ctx, next) => {
//     console.log(111)
//     messageDelivery(ctx)
// });

// router.get("/register", async (ctx, next) => {
//     await ctx.render("register", {});
// });

// router.post("/register", async (ctx, next) => {
//     await register(ctx)
// });

module.exports = router;
