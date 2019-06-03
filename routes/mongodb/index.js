const mongoose = require('mongoose');
const host = require('./host')
const Schema = mongoose.Schema;
const model = mongoose.model;
const UserInfoSchema = new Schema({
    openid: String,
    nickname: String,
    sex: Number,
    language: String,
    city: String,
    province: String,
    headimgurl: String,
    privilege: [String]
})
const db = mongoose.connection;
const UserInfo = model('userInfo', UserInfoSchema)
const connect = () => {
    mongoose.connect(host, { useNewUrlParser: true });
    db.on('error', () => {
        console.log('连接失败')
    })
    db.on('connected', () => {
        console.log('连接成功')
    })
}
const close = () => {
    db.close()
}
module.exports = {
    UserInfo,
    connect,
    close
}
