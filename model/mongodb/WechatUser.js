const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const WechatUserSchema = new Schema({
    openid: String,
    nickname: String,
    sex: Number,
    language: String,
    city: String,
    province: String,
    headimgurl: String,
    privilege: [String]
})
module.exports = model('WechatUser', WechatUserSchema)