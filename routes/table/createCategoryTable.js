const createCategoryTablsql = async (querySQL, shopID) => {
    const sql = `CREATE TABLE category_list_${shopID} (
                categoryID int(11) NOT NULL AUTO_INCREMENT,
                categoryName varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                shopID int(11) NULL DEFAULT NULL,
                PRIMARY KEY (categoryID) USING BTREE
                ) ENGINE = InnoDB AUTO_INCREMENT = 1000 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
            `
    await querySQL(sql)
}
module.exports = createCategoryTablsql