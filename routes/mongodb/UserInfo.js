const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
const UserInfoSchema = new Schema({
    openid: String,
    nickname: String,
    sex: Number,
    language: String,
    city: String,
    province: String,
    headimgurl: String,
    privilege: [String],
})
const UserInfo = model('userInfo', UserInfoSchema)
module.exports = UserInfo
