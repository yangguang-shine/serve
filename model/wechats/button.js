const host = require('./host')
module.exports = {
    "button": [
        {    
            "type": "view",
            "name": "授权",
            "url": `http://${host}/index`
        }, {    
            "type": "view",
            "name": "food",
            "url": `http://${host}/food/info`
        }, {    
            "type": "view",
            "name": "新闻热点",
            "url": `http://${host}/index`
        }]
}
// {
//     "name": "搜索引擎",
//     "sub_button": [
//         {    
//         "type": "view",
//         "name": "搜狗",
//         "url": "http: //www.soso.com/"
//         },
//         {
//             "type": "view",
//             "name": "百度",
//             "url": "http://www.baidu.com",
//         },
//         {
//             "type": "click",
//             "name": "赞一下我们",
//             "key": "yangguang-praise"
//         }]
// }