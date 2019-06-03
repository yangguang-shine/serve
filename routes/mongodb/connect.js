const mongoose = require('mongoose');
module.exports = () => {
    const db = mongoose.connection;
    mongoose.connect('mongodb://localhost:27017/data', { useNewUrlParser: true });
    db.on('error', () => {
        console.log('连接失败')
    })
    return db
}