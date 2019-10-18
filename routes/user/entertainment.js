const router = require("koa-router")();
const httpGet = require('../../tool/httpGet')
const food_key = 'f2770f608d21700c9900924fc9bdb3eb';
const cuisine_list_domain = 'http://apis.juhe.cn'
router.prefix("/user/api/entertainment");

router.get("/jokeList", async (ctx, next) => {

});
router.get("/newsList", async (ctx, next) => {

});
router.get("/cuisineList", async (ctx, next) => {
    try {
        const { cuisineName, pageNum } = ctx.query
        if (!cuisineName) {
            ctx.body = ctx.parameterError
            return
        }
        const url = `key=${food_key}&menu=${encodeURIComponent(cuisineName)}&pn=${pageNum || 0}&rn=10`
        const res = await httpGet(`${cuisine_list_domain}/cook/query?${url}`);
        const resData = JSON.parse(await ctx.dataFormat(res))
        if (resData.resultcode === "200") {
            ctx.body = {
                code: '000',
                msg: '获取成功',
                data: resData.result.data || []
            }
        } else {
            ctx.body = {
                code: '111',
                msg: resData.reason,
                data: []
            }
        }
    } catch (e) {
        ctx.body = {
            code: '111',
            msg: '接口调用失败',
            data: []
        }
    }
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
