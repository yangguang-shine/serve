const mongoose = require('mongoose');
const host = require('./host')
// const Schema = mongoose.Schema;
// const model = mongoose.model;
// const wechatUser = require('./wechatUser')
// const userInfo = require('./userInfo')
// const foodInfo = require('./foodInfo')

// const WechatUserSchema = new Schema(wechatUser)
// const FoodInfoSchema = new Schema(foodInfo)
// const UserInfoSchema = new Schema(userInfo)

// const WechatUser = model('wechatUser', WechatUserSchema)
// const FoodInfo = model('foodInfo', FoodInfoSchema)
// const UserInfo = model('userInfo', UserInfoSchema)

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
    console.log('连接')
}
function findOne (model, options) {
    return new Promise((resolve, reject) => {
        model.findOne(options, (err, result) => {
            if (err) {
                console.log('查找错误')
                console.log(err)
                reject(err)
            } else {
                console.log(options)
                console.log('查找成功')
                resolve(result)
            }
        })
    })
}
function saveOne (model, instance) {
    return new Promise((resolve, reject) => {
        model.create(instance, (err, result) => {
            if (err) {
                console.log('存储错误')
                console.log(err)
                reject(err)
            } else {
                console.log('存储成功')
                resolve(result)
            }
        })
    })
}
module.exports = {
    connect,
    findOne,
    saveOne,
    // WechatUser,
    // FoodInfo,
    // UserInfo,
}
