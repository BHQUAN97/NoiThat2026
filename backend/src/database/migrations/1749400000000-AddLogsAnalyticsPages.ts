import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Add tables: media, notifications, app_logs, page_configs, page_config_history,
 * page_views, page_view_daily — for logs/analytics/page-builder features.
 */
export class AddLogsAnalyticsPages1749400000000 implements MigrationInterface {
  name = 'AddLogsAnalyticsPages1749400000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── media ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`media\` (
        \`id\` char(26) NOT NULL,
        \`original_filename\` varchar(255) NOT NULL,
        \`mime_type\` varchar(50) NOT NULL,
        \`file_size\` int unsigned NOT NULL,
        \`original_url\` varchar(500) NOT NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`preview_url\` varchar(500) NULL,
        \`width\` int unsigned NULL,
        \`height\` int unsigned NULL,
        \`alt_text\` varchar(255) NULL,
        \`blurhash\` varchar(100) NULL,
        \`processing_status\` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
        \`processing_error\` text NULL,
        \`uploaded_by\` char(26) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`deleted_at\` timestamp NULL,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_media_uploaded_by\` (\`uploaded_by\`),
        KEY \`IDX_media_processing_status\` (\`processing_status\`),
        KEY \`IDX_media_deleted_at\` (\`deleted_at\`),
        CONSTRAINT \`FK_media_uploader\` FOREIGN KEY (\`uploaded_by\`) REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── notifications ─────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`notifications\` (
        \`id\` char(26) NOT NULL,
        \`user_id\` char(26) NOT NULL,
        \`type\` varchar(50) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`body\` text NULL,
        \`link\` varchar(500) NULL,
        \`is_read\` tinyint(1) NOT NULL DEFAULT 0,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_notifications_user_id\` (\`user_id\`),
        KEY \`IDX_notifications_is_read\` (\`is_read\`),
        KEY \`IDX_notifications_created_at\` (\`created_at\`),
        CONSTRAINT \`FK_notifications_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── app_logs ──────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`app_logs\` (
        \`id\` char(26) NOT NULL,
        \`level\` enum('error','warn','info','debug','trace') NOT NULL DEFAULT 'info',
        \`message\` varchar(500) NOT NULL,
        \`stack_trace\` text NULL,
        \`endpoint\` varchar(255) NULL,
        \`status_code\` smallint NULL,
        \`ip\` varchar(45) NULL,
        \`user_id\` char(26) NULL,
        \`user_agent\` varchar(500) NULL,
        \`context\` json NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_app_logs_level\` (\`level\`),
        KEY \`IDX_app_logs_created_at\` (\`created_at\`),
        KEY \`IDX_app_logs_level_created_at\` (\`level\`, \`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── page_configs ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`page_configs\` (
        \`id\` char(26) NOT NULL,
        \`page_slug\` varchar(100) NOT NULL,
        \`config_draft\` json NULL,
        \`config_published\` json NULL,
        \`version\` int unsigned NOT NULL DEFAULT 0,
        \`published_at\` timestamp NULL,
        \`published_by\` char(26) NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`updated_by\` char(26) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_page_configs_page_slug\` (\`page_slug\`),
        CONSTRAINT \`FK_page_configs_publisher\` FOREIGN KEY (\`published_by\`) REFERENCES \`users\` (\`id\`),
        CONSTRAINT \`FK_page_configs_updater\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── page_config_history ───────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`page_config_history\` (
        \`id\` char(26) NOT NULL,
        \`page_config_id\` char(26) NOT NULL,
        \`config_snapshot\` json NOT NULL,
        \`version\` int unsigned NOT NULL,
        \`published_at\` timestamp NULL,
        \`published_by\` char(26) NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_page_config_history_page_config_id\` (\`page_config_id\`),
        KEY \`IDX_page_config_history_version\` (\`version\`),
        CONSTRAINT \`FK_page_config_history_page\` FOREIGN KEY (\`page_config_id\`) REFERENCES \`page_configs\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_page_config_history_publisher\` FOREIGN KEY (\`published_by\`) REFERENCES \`users\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── page_views ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`page_views\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`page_path\` varchar(500) NOT NULL,
        \`visitor_ip\` varchar(45) NOT NULL,
        \`user_agent\` text NULL,
        \`referrer\` varchar(500) NULL,
        \`device_type\` enum('desktop','mobile','tablet') NULL,
        \`is_bot\` tinyint(1) NOT NULL DEFAULT 0,
        \`session_id\` varchar(100) NULL,
        \`viewed_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_page_views_page_path\` (\`page_path\`(191)),
        KEY \`IDX_page_views_viewed_at\` (\`viewed_at\`),
        KEY \`IDX_page_views_session_id\` (\`session_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── site_config: add type column nếu chưa có ─────────────────
    await queryRunner.query(`
      ALTER TABLE \`site_config\`
      ADD COLUMN IF NOT EXISTS \`type\` varchar(50) NOT NULL DEFAULT 'string'
    `).catch(() => {})

    // ── page_view_daily ───────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`page_view_daily\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`page_path\` varchar(500) NOT NULL,
        \`view_date\` date NOT NULL,
        \`total_views\` int unsigned NOT NULL DEFAULT 0,
        \`unique_visitors\` int unsigned NOT NULL DEFAULT 0,
        \`mobile_views\` int unsigned NOT NULL DEFAULT 0,
        \`desktop_views\` int unsigned NOT NULL DEFAULT 0,
        \`tablet_views\` int unsigned NOT NULL DEFAULT 0,
        \`bot_views\` int unsigned NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_page_view_daily_path_date\` (\`page_path\`(191), \`view_date\`),
        KEY \`IDX_page_view_daily_date\` (\`view_date\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `page_view_daily`')
    await queryRunner.query('DROP TABLE IF EXISTS `page_views`')
    await queryRunner.query('DROP TABLE IF EXISTS `page_config_history`')
    await queryRunner.query('DROP TABLE IF EXISTS `page_configs`')
    await queryRunner.query('DROP TABLE IF EXISTS `app_logs`')
    await queryRunner.query('DROP TABLE IF EXISTS `notifications`')
    await queryRunner.query('DROP TABLE IF EXISTS `media`')
  }
}
