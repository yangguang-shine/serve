const host = require('./host')
module.exports = {
    "button": [
        {
            "type": "view",
            "name": "授权",
            "url": `http://${host}/page/`
        }, {
            "type": "view",
            "name": "food",
            "url": `http://${host}/food/info`
        }]
}