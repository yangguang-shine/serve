const crypto = require('crypto');
const token = 'yangguang';
module.exports = (ctx) => {
    const query = ctx.query
    let arr = [token, query.timestamp, query.nonce]
    arr.sort()
    const arrStr = arr.join('')
    const signature = crypto.createHash('sha1').update(arrStr).digest('hex')
    if (query.signature === signature) {
        ctx.body = query.echostr
    } else {
        ctx.body = "错误"
    }
}