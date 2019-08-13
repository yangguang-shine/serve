const mysql = require('mysql');
const config = require('./mysql-host')
const pool = mysql.createPool(config)
const querySQL = (sql = '', params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                reject(err)
                return
            }
            con.query(sql, params, (e, res, fields) => {
                if (e) {
                    reject(e)
                } else {
                    console.log("SQL成功")
                    resolve(JSON.parse(JSON.stringify(res)))
                }
                con.release()
            })
        })
    })
}
module.exports = querySQL