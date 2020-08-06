const router = require("koa-router")();
const httpGet = require('../../tools/httpGet')

router.prefix("/user/api/entertainment");

router.get("/jokeList", async (ctx, next) => {
    try {
        const joke_key = 'f93b640770d982eeaf1004d564ee2e71';
        const joke_list_domain = 'http://v.juhe.cn/joke/content/list.php'
        const { sort, page, pagesize, time } = ctx.query
        if (!sort && !page && !pagesize && !time) {
            ctx.body = ctx.parameterError
            return
        }
        const url = `key=${joke_key}&sort=${encodeURIComponent(sort)}&page=${encodeURIComponent(page)}&pagesize=${encodeURIComponent(pagesize)}&time=${encodeURIComponent(time)}`
        const res = await httpGet(`${joke_list_domain}?${url}`);
        const resData = JSON.parse(await ctx.dataFormat(res))
        if (resData.reason === "Success") {
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
        const news_key = '074a12b156303ae068905d86d73233b5'
        const news_domain = 'http://v.juhe.cn/toutiao/index'
        const { type } = ctx.query
        if (!type) {
            ctx.body = ctx.parameterError
            return
        }
        const query = `key=${news_key}&type=${encodeURIComponent(type)}`
        const res = await httpGet(`${news_domain}?${query}`);
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
        const cuisine_list_domain = 'http://apis.juhe.cn/cook/query'
        const { cuisineName, pageNum } = ctx.query
        if (!cuisineName) {
            ctx.body = ctx.parameterError
            return
        }
        const url = `key=${food_key}&menu=${encodeURIComponent(cuisineName)}&pn=${pageNum || 0}&rn=10`
        const res = await httpGet(`${cuisine_list_domain}?${url}`);
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
router.get("/getAnswer", async (ctx, next) => {
    try {
// https://api.jisuapi.com/iqa/query?appkey=yourappkey&question=杭州天气
        const app_key = '0a7864f280b81212';
        const answer_list_domain = 'http://api.jisuapi.com/iqa/query'
        const { question } = ctx.query
        if (!question) {
            ctx.body = ctx.parameterError
            return
        }
        const url = `appkey=${app_key}&question=${encodeURIComponent(question)}`
        const res = await httpGet(`${answer_list_domain}?${url}`);
        const resData = JSON.parse(await ctx.dataFormat(res))
        console.log(resData)
        if (resData.status === 0) {
            ctx.body = {
                code: '000',
                msg: '获取成功',
                data: resData.result || {}
            }
        } else {
            ctx.body = {
                code: '111',
                msg: resData.msg,
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
