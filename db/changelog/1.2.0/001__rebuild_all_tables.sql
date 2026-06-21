-- ============================================================
-- 1.2.0/001: Rebuild all tables to match current entity schema
-- Date:   2026-06-21
-- Author: Claude
-- Reason: Production DB co tables cu (tu db/schema/tables/) voi schema
--         khac entity hien tai. DROP + CREATE lai toan bo.
-- WARNING: MAT TOAN BO DATA. Chi chay khi data la seed data.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop old tables that no longer exist in entity layer
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `project_gallery`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `consultations`;
DROP TABLE IF EXISTS `email_logs`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `settings`;

-- Drop tables that need schema rebuild
DROP TABLE IF EXISTS `page_config_history`;
DROP TABLE IF EXISTS `page_configs`;
DROP TABLE IF EXISTS `page_view_daily`;
DROP TABLE IF EXISTS `page_views`;
DROP TABLE IF EXISTS `app_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `form_submissions`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `pricing_tables`;
DROP TABLE IF EXISTS `news`;
DROP TABLE IF EXISTS `videos`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `login_attempts`;
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `site_config`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ── 1. users ──────────────────────────────────────────────
CREATE TABLE `users` (
  `id` char(26) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) NULL,
  `avatar_url` varchar(500) NULL,
  `role` enum('super_admin','admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  `status` enum('active','inactive','banned') NOT NULL DEFAULT 'active',
  `refresh_token_hash` varchar(255) NULL,
  `last_login_at` timestamp NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(26) NULL,
  `updated_by` char(26) NULL,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_users_email` (`email`),
  KEY `IDX_users_role` (`role`),
  KEY `IDX_users_status` (`status`),
  KEY `IDX_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. refresh_tokens ─────────────────────────────────────
CREATE TABLE `refresh_tokens` (
  `id` char(26) NOT NULL,
  `user_id` char(26) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_refresh_tokens_user_id` (`user_id`),
  CONSTRAINT `FK_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. login_attempts ─────────────────────────────────────
CREATE TABLE `login_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `success` tinyint(1) NOT NULL DEFAULT 0,
  `attempted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_login_attempts_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 4. password_reset_tokens ──────────────────────────────
CREATE TABLE `password_reset_tokens` (
  `id` char(26) NOT NULL,
  `user_id` char(26) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used_at` timestamp NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_prt_user` (`user_id`),
  CONSTRAINT `FK_prt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 5. product_categories ─────────────────────────────────
CREATE TABLE `product_categories` (
  `id` char(26) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text NULL,
  `thumbnail_url` varchar(500) NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_product_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 6. products ───────────────────────────────────────────
CREATE TABLE `products` (
  `id` char(26) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `category_id` char(26) NOT NULL,
  `short_description` text NULL,
  `description` longtext NULL,
  `thumbnail_url` varchar(500) NULL,
  `gallery_urls` json NULL,
  `specs` json NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_products_slug` (`slug`),
  KEY `IDX_products_category` (`category_id`),
  CONSTRAINT `FK_products_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 7. projects ───────────────────────────────────────────
CREATE TABLE `projects` (
  `id` char(26) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `province` varchar(100) NOT NULL,
  `location` varchar(200) NULL,
  `area_sqm` varchar(100) NULL,
  `description` text NULL,
  `thumbnail_url` varchar(500) NULL,
  `gallery_urls` json NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_projects_slug` (`slug`),
  KEY `IDX_projects_province` (`province`),
  KEY `IDX_projects_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 8. videos ─────────────────────────────────────────────
CREATE TABLE `videos` (
  `id` char(26) NOT NULL,
  `title` varchar(200) NOT NULL,
  `video_type` enum('youtube','upload') NOT NULL DEFAULT 'youtube',
  `youtube_id` varchar(100) NULL,
  `video_url` varchar(1000) NULL,
  `description` text NULL,
  `thumbnail_url` varchar(500) NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 9. news ───────────────────────────────────────────────
CREATE TABLE `news` (
  `id` char(26) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `excerpt` text NULL,
  `content` longtext NULL,
  `thumbnail_url` varchar(500) NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_news_slug` (`slug`),
  KEY `IDX_news_active` (`is_active`, `published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 10. pricing_tables ────────────────────────────────────
CREATE TABLE `pricing_tables` (
  `id` char(26) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NULL,
  `items` json NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 11. reviews ───────────────────────────────────────────
CREATE TABLE `reviews` (
  `id` char(26) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `location` varchar(100) NULL,
  `rating` tinyint NOT NULL DEFAULT 5,
  `content` text NOT NULL,
  `avatar_url` varchar(500) NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 12. form_submissions ──────────────────────────────────
CREATE TABLE `form_submissions` (
  `id` char(26) NOT NULL,
  `form_type` enum('quote','contact') NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(200) NULL,
  `content` json NULL,
  `status` enum('new','processing','done') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_form_submissions_status` (`status`),
  KEY `IDX_form_submissions_type` (`form_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 13. site_config ───────────────────────────────────────
CREATE TABLE `site_config` (
  `key` varchar(100) NOT NULL,
  `value` longtext NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'string',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 14. media ─────────────────────────────────────────────
CREATE TABLE `media` (
  `id` char(26) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `mime_type` varchar(50) NOT NULL,
  `file_size` int unsigned NOT NULL,
  `original_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) NULL,
  `preview_url` varchar(500) NULL,
  `width` int unsigned NULL,
  `height` int unsigned NULL,
  `alt_text` varchar(255) NULL,
  `blurhash` varchar(100) NULL,
  `processing_status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
  `processing_error` text NULL,
  `uploaded_by` char(26) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_media_uploaded_by` (`uploaded_by`),
  KEY `IDX_media_processing_status` (`processing_status`),
  KEY `IDX_media_deleted_at` (`deleted_at`),
  CONSTRAINT `FK_media_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 15. notifications ─────────────────────────────────────
CREATE TABLE `notifications` (
  `id` char(26) NOT NULL,
  `user_id` char(26) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NULL,
  `link` varchar(500) NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_notifications_user_id` (`user_id`),
  KEY `IDX_notifications_is_read` (`is_read`),
  KEY `IDX_notifications_created_at` (`created_at`),
  CONSTRAINT `FK_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 16. app_logs ──────────────────────────────────────────
CREATE TABLE `app_logs` (
  `id` char(26) NOT NULL,
  `level` enum('error','warn','info','debug','trace') NOT NULL DEFAULT 'info',
  `message` varchar(500) NOT NULL,
  `stack_trace` text NULL,
  `endpoint` varchar(255) NULL,
  `status_code` smallint NULL,
  `ip` varchar(45) NULL,
  `user_id` char(26) NULL,
  `user_agent` varchar(500) NULL,
  `context` json NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_app_logs_level` (`level`),
  KEY `IDX_app_logs_created_at` (`created_at`),
  KEY `IDX_app_logs_level_created_at` (`level`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 17. page_configs ──────────────────────────────────────
CREATE TABLE `page_configs` (
  `id` char(26) NOT NULL,
  `page_slug` varchar(100) NOT NULL,
  `config_draft` json NULL,
  `config_published` json NULL,
  `version` int unsigned NOT NULL DEFAULT 0,
  `published_at` timestamp NULL,
  `published_by` char(26) NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` char(26) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_page_configs_slug` (`page_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 18. page_config_history ───────────────────────────────
CREATE TABLE `page_config_history` (
  `id` char(26) NOT NULL,
  `page_config_id` char(26) NOT NULL,
  `config_snapshot` json NOT NULL,
  `version` int unsigned NOT NULL,
  `published_at` timestamp NULL,
  `published_by` char(26) NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_pch_page_config_id` (`page_config_id`),
  CONSTRAINT `FK_pch_page_config` FOREIGN KEY (`page_config_id`) REFERENCES `page_configs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 19. page_views (analytics, partitioned) ───────────────
CREATE TABLE `page_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `page_path` varchar(500) NOT NULL,
  `visitor_ip` varchar(45) NOT NULL,
  `user_agent` text NULL,
  `referrer` varchar(500) NULL,
  `device_type` enum('desktop','mobile','tablet') NULL,
  `is_bot` tinyint(1) NOT NULL DEFAULT 0,
  `session_id` varchar(100) NULL,
  `viewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `viewed_at`),
  KEY `IDX_page_views_page_path` (`page_path`(191)),
  KEY `IDX_page_views_viewed_at` (`viewed_at`),
  KEY `IDX_page_views_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (UNIX_TIMESTAMP(`viewed_at`)) (
  PARTITION p2026_q1 VALUES LESS THAN (UNIX_TIMESTAMP('2026-04-01')),
  PARTITION p2026_q2 VALUES LESS THAN (UNIX_TIMESTAMP('2026-07-01')),
  PARTITION p2026_q3 VALUES LESS THAN (UNIX_TIMESTAMP('2026-10-01')),
  PARTITION p2026_q4 VALUES LESS THAN (UNIX_TIMESTAMP('2027-01-01')),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ── 20. page_view_daily (analytics aggregate) ─────────────
CREATE TABLE `page_view_daily` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `page_path` varchar(500) NOT NULL,
  `view_date` date NOT NULL,
  `total_views` int unsigned NOT NULL DEFAULT 0,
  `unique_visitors` int unsigned NOT NULL DEFAULT 0,
  `mobile_views` int unsigned NOT NULL DEFAULT 0,
  `desktop_views` int unsigned NOT NULL DEFAULT 0,
  `tablet_views` int unsigned NOT NULL DEFAULT 0,
  `bot_views` int unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_page_view_daily_path_date` (`page_path`(191), `view_date`),
  KEY `IDX_page_view_daily_date` (`view_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Mark TypeORM migrations as applied ────────────────────
-- Tranh TypeORM chay lai migrations cu khi co bang moi
CREATE TABLE IF NOT EXISTS `typeorm_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `typeorm_migrations` (`timestamp`, `name`) VALUES
  (1749200000000, 'NoiThat2026InitialSchema1749200000000'),
  (1749400000000, 'AddLogsAnalyticsPages1749400000000'),
  (1750500000000, 'AddMissingMediaColumns1750500000000');

SELECT '=== 1.2.0/001: All 20 tables rebuilt successfully ===' AS result;
