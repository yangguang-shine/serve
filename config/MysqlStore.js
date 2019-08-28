const { querySQL } = require('../model/mysql/index')
class Store {
    async get (key, ctx) {
        try {
            const sql = `select * from my_session_store where session_key = ?`
            const data = await querySQL(sql, [key])
            console.log(data)
            if (data.length) {
                return JSON.parse(data[0].data).user;
            } else {
                return undefined;
            }
        } catch(e) {
            console.log(e)
        }
    }
    async set(key, sess, maxAge) {
        try {
            // Use redis set EX to automatically drop expired sessions
            console.log(sess)
            const sql = `insert into my_session_store (session_key, time, data) values (?, ?, ?)`
            await querySQL(sql, [key, `${+new Date()}`, JSON.stringify(sess)])
        } catch (e) {
            console.log(e)
        }
        return key;
    }
    async destroy(key, ctx) {
        try {
            const sql = `delete from my_session_store where session_key = ?`
            await querySQL(sql, [key])
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = Store