CREATE DATABASE  IF NOT EXISTS `leastscore` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `leastscore`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: leastscore
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `guest_sessions`
--

DROP TABLE IF EXISTS `guest_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_sessions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `display_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `socket_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Current socket.io socket ID.',
  `expires_at` timestamp NOT NULL COMMENT 'Kept far-future while connected; set to NOW()+60s on disconnect.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_guest_username` (`display_name`,`tag`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_sessions`
--

LOCK TABLES `guest_sessions` WRITE;
/*!40000 ALTER TABLE `guest_sessions` DISABLE KEYS */;
INSERT INTO `guest_sessions` VALUES (1,'Ryan','1234',NULL,'2026-04-28 12:12:43','2026-04-21 12:12:43');
/*!40000 ALTER TABLE `guest_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_sessions`
--

DROP TABLE IF EXISTS `otp_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_sessions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL COMMENT 'Valid for 10 minutes from creation.',
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone_expires` (`phone`,`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_sessions`
--

LOCK TABLES `otp_sessions` WRITE;
/*!40000 ALTER TABLE `otp_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `display_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Letters, numbers, underscores. 3-20 chars.',
  `tag` char(4) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '4 uppercase alphanumeric chars chosen by user.',
  `auth_provider` enum('local','google','microsoft','facebook','apple') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `provider_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'OAuth subject/sub from the provider.',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'E.164 format e.g. +919876543210',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'bcrypt hash. NULL for social-only accounts.',
  `token_version` int unsigned NOT NULL DEFAULT '0' COMMENT 'Increment on password change to invalidate old JWTs.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`display_name`,`tag`),
  UNIQUE KEY `uq_provider` (`auth_provider`,`provider_id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ronnie','DUKE','local',NULL,NULL,'+918108100142','$2b$12$Zz7TkAHdxlv6hxACyQw2Xufqx.KauyZbAWZyr9TlJA2NVQ8de.H5y',0,'2026-04-21 12:12:24','2026-04-21 12:12:24');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 19:57:47

-- ============================================================
-- Required Settings & Events for LeastScore
-- ============================================================

-- Ensure the event scheduler is running so guest sessions are cleaned up
SET GLOBAL event_scheduler = ON;

-- Cleanup event: remove expired guest sessions every minute
DROP EVENT IF EXISTS cleanup_expired_guests;
CREATE EVENT cleanup_expired_guests
  ON SCHEDULE EVERY 1 MINUTE
  DO
    DELETE FROM guest_sessions WHERE expires_at < NOW();
