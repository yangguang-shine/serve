const router = require("koa-router")();
const httpGet = require('../../tool/httpGet')

router.prefix("/user/api/entertainment");

router.get("/jokeList", async (ctx, next) => {
    try {
        const joke_key = 'f2770f608d21700c9900924fc9bdb3eb';
        const cuisine_list_domain = 'http://apis.juhe.cn'
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

router.get("/newsList", async (ctx, next) => {
    try {
        const news_key = ''
        const news_domain = 'http://v.juhe.cn'
        const { type } = ctx.query
        if (!type) {
            ctx.body = ctx.parameterError
            return
        }
        const query = `key=${news_key}&type=${encodeURIComponent(type)}`
        const res = await httpGet(`${news_domain}/toutiao/index?${query}`);
        const resData = JSON.parse(await ctx.dataFormat(res))
        if (resData.result && resData.result.data && resData.result.data.length) {
            ctx.body = {
                code: '000',
                msg: '获取成功',
                data: resData.result.data
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

router.get("/cuisineList", async (ctx, next) => {
    try {
        const food_key = 'f2770f608d21700c9900924fc9bdb3eb';
        const cuisine_list_domain = 'http://apis.juhe.cn'
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

module.exports = router;
