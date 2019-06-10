const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const UserInfoSchema = new Schema({
    account: Number,
    encodePassword: String
})
module.exports = model('UserInfo', UserInfoSchema)