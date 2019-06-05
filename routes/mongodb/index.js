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
const UserInfo = model('userInfo', UserInfoSchema)
const db = mongoose.connection;
db.on('error', () => {
    console.log('连接失败')
})
db.on('connected', () => {
    console.log('连接成功')
})
db.on('disconnected', () => {
    console.log('db disconnected');
    });
db.on('close', () => {
    console.log('db close');
});
const connect = () => {
    mongoose.connect(host, { useNewUrlParser: true });
    return db
}
function findOne (model, options, fn) {
    console.log(8768)
    return new Promise((resolve, reject) => {
        model.findOne(options, (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                console.log(999)
                resolve(result)
            }
        })
    })
}
module.exports = {
    UserInfo,
    connect,
    findOne
}
