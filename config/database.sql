-- Birthday Wishes Database Schema
-- Compatible with MySQL 5.7+ and MariaDB 10.2+

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `birthday_wishes` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `birthday_wishes`;

-- Drop tables if they exist (for clean installation)
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `wishes_generated`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admin_users`;

-- ============================================
-- Table: users
-- Stores visitor information
-- ============================================
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `browser` VARCHAR(50) DEFAULT NULL,
  `operating_system` VARCHAR(50) DEFAULT NULL,
  `language` VARCHAR(20) DEFAULT NULL,
  `timezone` VARCHAR(50) DEFAULT NULL,
  `device_type` VARCHAR(20) DEFAULT NULL,
  `screen_resolution` VARCHAR(20) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: wishes_generated
-- Stores all generated wishes
-- ============================================
CREATE TABLE `wishes_generated` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL,
  `wish_text` TEXT NOT NULL,
  `generated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category` (`category`),
  KEY `idx_generated_at` (`generated_at`),
  CONSTRAINT `fk_wishes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: favorites
-- Stores user's favorite wishes
-- ============================================
CREATE TABLE `favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `wish_text` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: admin_users
-- Stores admin login credentials
-- ============================================
CREATE TABLE `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert default admin user
-- Username: admin
-- Password: admin123 (CHANGE THIS IMMEDIATELY!)
-- ============================================
INSERT INTO `admin_users` (`username`, `password_hash`, `email`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@birthdaywishes.local');

-- ============================================
-- Create view for wish statistics
-- ============================================
CREATE OR REPLACE VIEW `wish_statistics` AS
SELECT 
    category,
    COUNT(*) as total_wishes,
    DATE(generated_at) as wish_date
FROM wishes_generated
GROUP BY category, DATE(generated_at);

COMMIT;
