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

 Date: 15/08/2019 15:50:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for food_info
-- ----------------------------
DROP TABLE IF EXISTS `food_info`;
CREATE TABLE `food_info`  (
  `foodID` int(11) NOT NULL AUTO_INCREMENT,
  `foodName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `categoryID` int(11) NULL DEFAULT NULL,
  `categoryName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT 0.00,
  `unit` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `orderCount` int(255) NULL DEFAULT 0,
  `imgUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `shopID` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`foodID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10030 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
