
# 点餐项目

## 运行流程

1. 安装node 和 mysql
2. 执行目录下testData的mysql语句增加表
3. 执行命令 npm install
4. 执行 npm run dev

## 架构说明

1. 使用了 koa2 框架进行开发

## 注意事项

1. 使用了 fs 的promise API


### 开发记录

1. 一开始给每个用户都建立了几个表（那时为了快速查找，不了解索引），如用户地址表、用户下单表、用户菜品表等，后期发现如果想给表添加新字段，将是一件非常庞大的数据量，因此将这些表都整合成一个表，在后期SQL数据读取慢时建立索引，提高查询效率

2. 不知不觉命令行使用sql基本操作已经熟练，像什么多次进行删表、加表、修改表名称、修改字段、字段结构等，给表添加了索引，提升查询效率

3. 

### SQL (大写是关键字，小写是需要修改的值)

### 显示数据库或表

    SHOW DATABASES --- 显示所有数据库

    SHOW TABLES --- 显示数据库下的所有表

    USE my_data_base --- 使用数据库 

#### 添加索引

    ALTER TABLE token_store_user ADD INDEX indexUserID (userID);

#### 展示索引

    SHOW INDEX FROM shop_food_info;

#### 删除索引

    DROP INDEX indexOrderKey ON order_food_list;

#### 新增表字段

    ALTER TABLE user_address_list ADD [字段名] NVARCHAR (50) NULL  

#### 修改字段名称和改变数据结构

    ALTER TABLE order_key_list CHANGE orderTime orderTime bigint(20);

    ALTER TABLE order_key_list RENAME COLUMN orderKeyID TO id; --- 仅修改属性名称

#### 修改表的自增初始值

    ALTER TABLE order_key_list AUTO_INCREMENT = 1;

#### 修改表的名称

    ALTER TABLE  user_token_store RENAME TO token_store_user;

#### 删除表

    DROP TABLES shop_order_key_list , user_order_food_list  ;

#### 删除主键
    ALTER TABLE order_key_list CHANGE id id int(10); --- 先删除自增
    ALTER TABLE order_key_list DROP PRIMARY KEY; --- 再删除主键
    
#### 清空表信息主键
    TRUNCATE TABLE table_name;
    DELETE * FROM table_name;
    truncate 是整体删除 (速度较快)，delete是逐条删除 (速度较慢)

   