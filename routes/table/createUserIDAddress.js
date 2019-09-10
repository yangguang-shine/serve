const createUserIDAddress = async (querySQL, userID) => {
    const sql = `CREATE TABLE address_list_${userID}  (
        addressID int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
        mobile varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
        address1 varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
        address2 varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
        sex int(1) NULL DEFAULT 1,
        PRIMARY KEY (addressID) USING BTREE
      ) ENGINE = InnoDB AUTO_INCREMENT = 100000 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
    await querySQL(sql)
}
module.exports = createUserIDAddress