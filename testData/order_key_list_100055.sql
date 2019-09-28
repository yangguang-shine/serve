/*
 Navicat Premium Data Transfer

 Source Server         : yangguang
 Source Server Type    : MySQL
 Source Server Version : 80017
 Source Host           : localhost:3306
 Source Schema         : my_data_base

 Target Server Type    : MySQL
 Target Server Version : 80017
 File Encoding         : 65001

 Date: 28/09/2019 18:16:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order_key_list_100055
-- ----------------------------
DROP TABLE IF EXISTS `order_key_list_100055`;
CREATE TABLE `order_key_list_100055`  (
  `orderKey` bigint(255) NOT NULL,
  `orderKeyID` int(11) NOT NULL AUTO_INCREMENT,
  `shopID` int(11) NULL DEFAULT NULL,
  `orderAmount` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `orderTime` timestamp(0) NULL DEFAULT NULL,
  `businessType` int(2) NULL DEFAULT NULL,
  `minusPrice` int(10) NULL DEFAULT NULL,
  `takeOutTime` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `selfTakeTime` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `reservePhone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `orderStatus` int(5) NULL DEFAULT 10,
  `userID` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`orderKeyID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
