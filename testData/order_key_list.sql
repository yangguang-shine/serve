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

 Date: 22/08/2019 17:03:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order_key_list
-- ----------------------------
DROP TABLE IF EXISTS `order_key_list`;
CREATE TABLE `order_key_list`  (
  `orderKey` bigint(255) NOT NULL,
  `orderKeyID` int(11) NOT NULL AUTO_INCREMENT,
  `shopID` int(11) NULL DEFAULT NULL,
  `orderAmount` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `orderTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`orderKeyID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
