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
                    resolve(JSON.parse(JSON.stringify(res)))
                }
                con.release()
            })
        })
    })
}
const SQLtransaction = (func) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                reject(err)
                return
            }
            con.beginTransaction(async (e) => {
                if (err) {
                    reject(err)
                    return
                }
                try {
                    const conQuerySQL = (sql, params) => {
                        return new Promise((resolve, reject) => {
                            con.query(sql, params, (e, res, fields) => {
                                if (e) {
                                    reject(e)
                                } else {
                                    resolve(JSON.parse(JSON.stringify(res)))
                                }
                            })
                        })
                    }
                    const funcPromise = func(conQuerySQL)
                    const result = await funcPromise
                    con.commit(err => { // 事务处理函数resolve则提交事务
                        if(err) {
                            reject(err)
                        }else {
                            resolve(result)
                        }
                    })
                } catch (err) {
                    con.rollback(() => { // 事务处理函数reject则回滚事务
                        reject(err)
                    })
                } finally {
                    con.release()
                }
            })
        })
    })

}
// conn.beginTransaction((err) => { //开始事务处理
//     if(err) {
//         conn.release()
//         reject(err)
//     }else {
//         let promise = tran(conn)  //调用事务处理函数
//         promise.then(result => {
//             conn.commit(err => {  //事务处理函数resolve则提交事务
//                 if(err) {
//                     reject(err)
//                 }else {
//                     resolve(result)
//                 }
//             })
//         }).catch(err => {
//             conn.rollback(() => {  //事务处理函数reject则回滚事务
//                 conn.release()
//                 reject(err)
//             })
//         })
//     }
// })
module.exports = {
    querySQL,
    SQLtransaction
}