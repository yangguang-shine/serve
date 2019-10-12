const router = require("koa-router")();

router.prefix("/api/entertainment");

router.get("/jokeList", async (ctx, next) => {

});
router.get("/newsList", async (ctx, next) => {

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
