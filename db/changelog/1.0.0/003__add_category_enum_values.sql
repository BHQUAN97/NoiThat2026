-- ============================================================
-- 1.0.0/003: Add 'article' and 'material' to categories.type enum
-- Date:   2026-04-08
-- Author: Claude
-- Fixes:  QueryFailedError: Data truncated for column 'type'
-- Note:   Skip if categories table no longer exists (replaced in 1.2.0)
-- ============================================================

SELECT COUNT(*) INTO @tbl_exists FROM information_schema.TABLES
WHERE table_schema = DATABASE() AND table_name = 'categories';

SET @sql = IF(@tbl_exists > 0,
  'ALTER TABLE `categories` MODIFY COLUMN `type` ENUM(''project'',''product'',''article'',''material'') NOT NULL',
  'SELECT ''[SKIP] categories table not found'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT 'V003: categories.type enum — done' AS changelog_status;
