-- Them cot scheduled_publish_at cho articles, projects, products
-- Tuong duong TypeORM migration: 1776510000000-AddScheduledPublishAt
-- Idempotent: kiem tra TABLE + COLUMN truoc khi ALTER
-- Skip neu table khong ton tai (schema da thay doi trong 1.2.0)

-- === articles ===
SELECT COUNT(*) INTO @tbl_exists FROM information_schema.TABLES
WHERE table_schema = DATABASE() AND table_name = 'articles';

SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS
WHERE table_schema = DATABASE() AND table_name = 'articles' AND column_name = 'scheduled_publish_at';
SET @sql = IF(@tbl_exists > 0 AND @col_exists = 0,
  'ALTER TABLE `articles` ADD COLUMN `scheduled_publish_at` TIMESTAMP NULL DEFAULT NULL',
  'SELECT 1 -- articles skip');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @idx_exists FROM information_schema.STATISTICS
WHERE table_schema = DATABASE() AND table_name = 'articles' AND index_name = 'IDX_articles_scheduled_publish_at';
SET @sql = IF(@tbl_exists > 0 AND @idx_exists = 0,
  'CREATE INDEX `IDX_articles_scheduled_publish_at` ON `articles` (`scheduled_publish_at`)',
  'SELECT 1 -- articles idx skip');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- === projects ===
SELECT COUNT(*) INTO @tbl_exists FROM information_schema.TABLES
WHERE table_schema = DATABASE() AND table_name = 'projects';

SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS
WHERE table_schema = DATABASE() AND table_name = 'projects' AND column_name = 'scheduled_publish_at';
SET @sql = IF(@tbl_exists > 0 AND @col_exists = 0,
  'ALTER TABLE `projects` ADD COLUMN `scheduled_publish_at` TIMESTAMP NULL DEFAULT NULL',
  'SELECT 1 -- projects skip');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @idx_exists FROM information_schema.STATISTICS
WHERE table_schema = DATABASE() AND table_name = 'projects' AND index_name = 'IDX_projects_scheduled_publish_at';
SET @sql = IF(@tbl_exists > 0 AND @idx_exists = 0,
  'CREATE INDEX `IDX_projects_scheduled_publish_at` ON `projects` (`scheduled_publish_at`)',
  'SELECT 1 -- projects idx skip');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- === products ===
SELECT COUNT(*) INTO @tbl_exists FROM information_schema.TABLES
WHERE table_schema = DATABASE() AND table_name = 'products';

SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS
WHERE table_schema = DATABASE() AND table_name = 'products' AND column_name = 'scheduled_publish_at';
SET @sql = IF(@tbl_exists > 0 AND @col_exists = 0,
  'ALTER TABLE `products` ADD COLUMN `scheduled_publish_at` TIMESTAMP NULL DEFAULT NULL',
  'SELECT 1 -- products skip');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @idx_exists FROM information_schema.STATISTICS
WHERE table_schema = DATABASE() AND table_name = 'products' AND index_name = 'IDX_products_scheduled_publish_at';
SET @sql = IF(@tbl_exists > 0 AND @idx_exists = 0,
  'CREATE INDEX `IDX_products_scheduled_publish_at` ON `products` (`scheduled_publish_at`)',
  'SELECT 1 -- products idx skip');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
