const createOrderList = async (querySQL, orderKey) => {
    const sql = `CREATE TABLE order_list_${orderKey}  (
                id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
                foodID int(11) NOT NULL,
                orderCount int(11) NULL DEFAULT NULL,
                imgUrl varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                foodName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                categoryID int(11) NOT NULL,
                price decimal(10, 2) NULL DEFAULT NULL,
                unit varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                description varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                categoryName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                PRIMARY KEY (id) USING BTREE
            ) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
    await querySQL(sql)
}
module.exports = createOrderList