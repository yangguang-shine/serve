
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

    ALTER TABLE user_address_list ADD [字段名] NVARCHAR (50) not NULL  

#### 修改字段名称和改变数据结构

    ALTER TABLE order_key_list CHANGE orderTime orderTime bigint(20);
    ALTER TABLE order_key_list CHANGE orderTime orderTime bigint(20) default 0;
    ALTER TABLE order_key_list CHANGE orderTime orderTime bigint(20) default 0 not null;


    ALTER TABLE order_key_list RENAME COLUMN orderKeyID TO id; --- 仅修改属性名称

#### 修改表的自增初始值

    ALTER TABLE order_key_list AUTO_INCREMENT = 1;

#### 修改表的名称

    ALTER TABLE  user_token_store RENAME TO token_store_user;

#### 删除表

    DROP TABLES shop_order_key_list , user_order_food_list  ;

#### 删除主键

    ALTER TABLE order_key_list CHANGE id id int(10); --- 先删除自增
    ALTER TABLE order_key_list DROP PRIMARY KEY; --- 再删除主键;

#### 清空表信息

    TRUNCATE TABLE table_name;
    DELETE * FROM table_name;
    truncate 是整体删除 (速度较快)，delete是逐条删除 (速度较慢);

#### 查看表字段信息结构

    DESC table_name;


    TRUNCATE TABLE order_food_list;
    ALTER TABLE order_key_list CHANGE orderTime orderTime bigint(20);

#### 一次性更新多条数据
    UPDATE mytable SET

        myfield = CASE foodID

            WHEN 1 THEN 'value'

            WHEN 2 THEN 'value'

            WHEN 3 THEN 'value'

        END

    WHERE foodID IN (1,2,3)

#### 删除表一行数据

    DELETE FROM order_food_list WHERE categoryID = 1161;

#### 修改表的数据结构
    ALTER TABLE order_food_list CHANGE orderCount orderCount int default 0  not  null;
    ALTER TABLE order_food_list CHANGE imgUrl imgUrl varchar(255)  not  null;
    ALTER TABLE order_food_list CHANGE foodName foodName varchar(255) not  null;
    ALTER TABLE order_food_list CHANGE unit unit varchar(255) not  null;
    ALTER TABLE order_food_list CHANGE description description varchar(255) not  null;
    ALTER TABLE order_food_list CHANGE categoryName categoryName varchar(255) not  null;
    ALTER TABLE order_food_list CHANGE orderKey orderKey varchar(50) not  null;
    ALTER TABLE order_food_list CHANGE categoryID categoryID int not  null;
    ALTER TABLE order_food_list CHANGE price price decimal(10,2) not  null;


    order_key_list 
    ALTER TABLE order_key_list CHANGE orderKey orderKey varchar(50) not  null;
    ALTER TABLE order_key_list CHANGE payPrice payPrice decimal(10,2) not  null;
    ALTER TABLE order_key_list CHANGE orderTime orderTime bigint not  null;
    ALTER TABLE order_key_list CHANGE businessType businessType int not  null;
    ALTER TABLE order_key_list CHANGE minusPrice minusPrice decimal(10,2) not  null;
    ALTER TABLE order_key_list CHANGE takeOutTime takeOutTime varchar(50) default '' not  null;
    ALTER TABLE order_key_list CHANGE selfTakeTime selfTakeTime varchar(50) default '' not  null;
    ALTER TABLE order_key_list CHANGE reservePhone reservePhone varchar(50) not  null;
    ALTER TABLE order_key_list CHANGE address address varchar(1000) not  null;
    ALTER TABLE order_key_list CHANGE orderStatus orderStatus int not  null;
    ALTER TABLE order_key_list CHANGE orderOriginAmount orderOriginAmount decimal(10,2) not  null;
    ALTER TABLE order_key_list CHANGE noteText noteText varchar(255) not  null;
    ALTER TABLE order_key_list CHANGE allPackPrice allPackPrice decimal(10,2) not  null;
    ALTER TABLE order_key_list CHANGE deliverPrice deliverPrice decimal(10,2) not  null;


    shop_food_info
    ALTER TABLE shop_food_info CHANGE foodName foodName varchar(255) not  null;
    ALTER TABLE shop_food_info CHANGE categoryID categoryID int not  null;
    ALTER TABLE shop_food_info CHANGE categoryName categoryName varchar(255) not  null;
    ALTER TABLE shop_food_info CHANGE unit unit varchar(255) not  null;
    ALTER TABLE shop_food_info CHANGE price price decimal(10,2) not  null;
    ALTER TABLE shop_food_info CHANGE orderCount orderCount int default 0  not  null;
    ALTER TABLE shop_food_info CHANGE imgUrl imgUrl varchar(255)  not  null;
    ALTER TABLE shop_food_info CHANGE description description varchar(255) not  null;
    ALTER TABLE shop_food_info CHANGE shopID shopID int not  null;
    ALTER TABLE shop_food_info CHANGE manageID manageID int not  null;
    ALTER TABLE shop_food_info CHANGE packPrice packPrice decimal(10,2) not  null;
    ALTER TABLE shop_food_info CHANGE reserveCount reserveCount int default 0 not  null;

    shop_list
    ALTER TABLE shop_list CHANGE minus minus varchar(500)  not  null;
    ALTER TABLE shop_list CHANGE manageID manageID int  not  null;
    ALTER TABLE shop_list CHANGE description description varchar(500)  not  null;
    ALTER TABLE shop_list CHANGE mainColor mainColor varchar(50)  not  null;
    ALTER TABLE shop_list CHANGE deliverPrice deliverPrice decimal(10,2) 0.00 not  null;
    ALTER TABLE shop_list CHANGE startDeliverPrice startDeliverPrice decimal(10,2) default 0.00 not  null;
    ALTER TABLE shop_list CHANGE mode mode varchar(50) default 'vertical' not  null;

    user_address_list

    ALTER TABLE user_address_list CHANGE name name varchar(255) not  null;
    ALTER TABLE user_address_list CHANGE mobile mobile varchar(255) not  null;
    ALTER TABLE user_address_list CHANGE address1 address1 varchar(255) not  null;
    ALTER TABLE user_address_list CHANGE address2 address2 varchar(255) not  null;
    ALTER TABLE user_address_list CHANGE sex sex int  not  null;
    ALTER TABLE user_address_list CHANGE latitude latitude varchar(50) not  null;
    ALTER TABLE user_address_list CHANGE longitude longitude varchar(50) not  null;


packPrice


noteText
orderStatus
    address

takeOutTime
minusPrice
businessType
orderTime
    

price
    <!-- ALTER TABLE order_food_list CHANGE categoryID categoryID int not  null; -->
    foodName
    categoryID
    ALTER TABLE order_food_list CHANGE orderCount orderCount int default 0  not  null;


#### 导出数据库和导出表 导入ngfan 
/usr/local/MYSQ/bin/mysqldump -u root -p [DATABASE] > ./data.sql
/usr/local/MYSQ/bin/mysqldump -u root -p [DATABASE] > [TABLE] ./data.sql
/usr/local/MYSQ/bin/mysqldump -u root -p [DATABASE] [TABLE]>  ./data.sql
mysql -u root -p my_data_base < G:\github\my.sql

#### 创建数据库

 create database my_data_base default charset=utf8;

#### 功能添加


1. 7.5 实现美团数据批量导入（特殊符号如表情会导入会失败）
