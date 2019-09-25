const createUserIDOrShopIDOrderKeyList = async ({ querySQL, userID = '', shopID = '' } = {}) => {
  let sql = ''
  if (userID) {
    sql = `CREATE TABLE order_key_list_${userID} (
      orderKey bigint(255) NOT NULL,
      orderKeyID int(11) NOT NULL AUTO_INCREMENT,
      shopID int(11) NULL DEFAULT NULL,
      orderAmount varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      orderTime timestamp(0) NULL DEFAULT NULL,
      businessType int(2) NULL DEFAULT NULL,
      minusPrice int(10) NULL DEFAULT NULL,
      takeOutTime varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      selfTakeTime varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      reservePhone varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      address varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      PRIMARY KEY (orderKeyID) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
  } else if (shopID) {
    sql = `CREATE TABLE order_key_list_${shopID} (
      orderKey bigint(255) NOT NULL,
      orderKeyID int(11) NOT NULL AUTO_INCREMENT,
      shopID int(11) NULL DEFAULT NULL,
      orderAmount varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      orderTime timestamp(0) NULL DEFAULT NULL,
      businessType int(2) NULL DEFAULT NULL,
      minusPrice int(10) NULL DEFAULT NULL,
      takeOutTime varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      selfTakeTime varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      reservePhone varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      address varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
      userID int(11) NULL DEFAULT NULL,
      PRIMARY KEY (orderKeyID) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
  }
  await querySQL(sql)
}
module.exports = createUserIDOrShopIDOrderKeyList