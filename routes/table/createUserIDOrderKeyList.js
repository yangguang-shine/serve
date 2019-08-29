const createUserIDOrderKeyList = async (querySQL, userID) => {
    const sql = `CREATE TABLE IF NOT EXISTS order_key_list_${userID} (
      orderKey bigint(100) NOT NULL,
      orderKeyID int(11) NOT NULL AUTO_INCREMENT,
      shopID int(11) NULL DEFAULT NULL,
      orderAmount varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      orderTime datetime(0) NULL DEFAULT NULL,
      PRIMARY KEY (orderKeyID) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
    await querySQL(sql)
}
module.exports = createUserIDOrderKeyList