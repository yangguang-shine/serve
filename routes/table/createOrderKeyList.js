const createOrderKeyList = async (querySQL, orderKey) => {
    const sql = `CREATE TABLE order_key_list  (
            orderKey bigint(255) NOT NULL,
            orderKeyID int(11) NOT NULL AUTO_INCREMENT,
            shopID int(11) NULL DEFAULT NULL,
            orderAmount varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
            orderTime datetime(0) NULL DEFAULT NULL,
            PRIMARY KEY (orderKeyID) USING BTREE
        ) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
    await querySQL(sql)
}
module.exports = createOrderKeyList