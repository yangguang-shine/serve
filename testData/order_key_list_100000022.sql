/*
 Navicat Premium Data Transfer

 Source Server         : my_data_base
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : my_data_base

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 18/06/2020 18:05:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order_key_list_100000022
-- ----------------------------
DROP TABLE IF EXISTS `order_key_list_100000022`;
CREATE TABLE `order_key_list_100000022` (
  `orderKey` bigint NOT NULL,
  `orderKeyID` int NOT NULL AUTO_INCREMENT,
  `shopID` int DEFAULT NULL,
  `orderAmount` decimal(20,0) DEFAULT NULL,
  `orderTime` timestamp NULL DEFAULT NULL,
  `businessType` int DEFAULT NULL,
  `minusPrice` int DEFAULT NULL,
  `takeOutTime` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `selfTakeTime` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `reservePhone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `address` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `orderStatus` int DEFAULT '10',
  `originOrderAmount` decimal(20,0) DEFAULT NULL,
  PRIMARY KEY (`orderKeyID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
