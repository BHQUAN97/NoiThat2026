import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Initial schema cho NoiThat2026 — Nội Thất Duy Mạnh
 * 9 tables: users, auth, product_categories, products, projects,
 *           videos, news, pricing_tables, reviews, form_submissions, site_config
 */
export class NoiThat2026InitialSchema1749200000000 implements MigrationInterface {
  name = 'NoiThat2026InitialSchema1749200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. users ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` char(26) NOT NULL,
        \`full_name\` varchar(100) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password_hash\` varchar(255) NOT NULL,
        \`phone\` varchar(20) NULL,
        \`avatar_url\` varchar(500) NULL,
        \`role\` enum('super_admin','admin','editor','viewer') NOT NULL DEFAULT 'viewer',
        \`status\` enum('active','inactive','banned') NOT NULL DEFAULT 'active',
        \`refresh_token_hash\` varchar(255) NULL,
        \`last_login_at\` timestamp NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` timestamp NULL,
        \`created_by\` char(26) NULL,
        \`updated_by\` char(26) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_users_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 2. refresh_tokens ──────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`refresh_tokens\` (
        \`id\` char(26) NOT NULL,
        \`user_id\` char(26) NOT NULL,
        \`token_hash\` varchar(255) NOT NULL,
        \`expires_at\` timestamp NOT NULL,
        \`revoked_at\` timestamp NULL,
        \`ip_address\` varchar(45) NULL,
        \`user_agent\` text NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_refresh_tokens_user_id\` (\`user_id\`),
        CONSTRAINT \`FK_refresh_tokens_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 3. login_attempts ──────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`login_attempts\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`ip_address\` varchar(45) NULL,
        \`success\` tinyint(1) NOT NULL DEFAULT 0,
        \`attempted_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_login_attempts_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 4. product_categories ─────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`product_categories\` (
        \`id\` char(26) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`slug\` varchar(100) NOT NULL,
        \`description\` text NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_product_categories_slug\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 5. products ───────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` char(26) NOT NULL,
        \`category_id\` char(26) NOT NULL,
        \`name\` varchar(200) NOT NULL,
        \`slug\` varchar(200) NOT NULL,
        \`short_description\` text NULL,
        \`description\` longtext NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`gallery_urls\` json NULL,
        \`specs\` json NULL,
        \`is_featured\` tinyint(1) NOT NULL DEFAULT 0,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_products_slug\` (\`slug\`),
        KEY \`IDX_products_category\` (\`category_id\`),
        CONSTRAINT \`FK_products_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 6. projects ───────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`projects\` (
        \`id\` char(26) NOT NULL,
        \`name\` varchar(200) NOT NULL,
        \`slug\` varchar(200) NOT NULL,
        \`province\` varchar(100) NOT NULL,
        \`location\` varchar(200) NULL,
        \`area_sqm\` varchar(100) NULL,
        \`description\` text NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`gallery_urls\` json NULL,
        \`is_featured\` tinyint(1) NOT NULL DEFAULT 0,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_projects_slug\` (\`slug\`),
        KEY \`IDX_projects_province\` (\`province\`),
        KEY \`IDX_projects_featured\` (\`is_featured\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 7. videos ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`videos\` (
        \`id\` char(26) NOT NULL,
        \`title\` varchar(200) NOT NULL,
        \`video_type\` enum('youtube','upload') NOT NULL DEFAULT 'youtube',
        \`youtube_id\` varchar(100) NULL,
        \`video_url\` varchar(1000) NULL,
        \`description\` text NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 8. news ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`news\` (
        \`id\` char(26) NOT NULL,
        \`title\` varchar(200) NOT NULL,
        \`slug\` varchar(200) NOT NULL,
        \`excerpt\` text NULL,
        \`content\` longtext NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`is_featured\` tinyint(1) NOT NULL DEFAULT 0,
        \`published_at\` datetime NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_news_slug\` (\`slug\`),
        KEY \`IDX_news_active\` (\`is_active\`, \`published_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 9. pricing_tables ─────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`pricing_tables\` (
        \`id\` char(26) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`description\` text NULL,
        \`items\` json NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 10. reviews ───────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`id\` char(26) NOT NULL,
        \`customer_name\` varchar(100) NOT NULL,
        \`location\` varchar(100) NULL,
        \`rating\` tinyint(1) NOT NULL DEFAULT 5,
        \`content\` text NOT NULL,
        \`avatar_url\` varchar(500) NULL,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`is_featured\` tinyint(1) NOT NULL DEFAULT 0,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 11. form_submissions ──────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`form_submissions\` (
        \`id\` char(26) NOT NULL,
        \`form_type\` enum('quote','contact') NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`phone\` varchar(20) NOT NULL,
        \`email\` varchar(200) NULL,
        \`content\` json NULL,
        \`status\` enum('new','processing','done') NOT NULL DEFAULT 'new',
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_form_submissions_status\` (\`status\`),
        KEY \`IDX_form_submissions_type\` (\`form_type\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 12. site_config ───────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`site_config\` (
        \`key\` varchar(100) NOT NULL,
        \`value\` text NOT NULL,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // ── 13. password_reset_tokens ─────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`password_reset_tokens\` (
        \`id\` char(26) NOT NULL,
        \`user_id\` char(26) NOT NULL,
        \`token_hash\` varchar(255) NOT NULL,
        \`expires_at\` timestamp NOT NULL,
        \`used_at\` timestamp NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_prt_user\` (\`user_id\`),
        CONSTRAINT \`FK_prt_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `password_reset_tokens`')
    await queryRunner.query('DROP TABLE IF EXISTS `site_config`')
    await queryRunner.query('DROP TABLE IF EXISTS `form_submissions`')
    await queryRunner.query('DROP TABLE IF EXISTS `reviews`')
    await queryRunner.query('DROP TABLE IF EXISTS `pricing_tables`')
    await queryRunner.query('DROP TABLE IF EXISTS `news`')
    await queryRunner.query('DROP TABLE IF EXISTS `videos`')
    await queryRunner.query('DROP TABLE IF EXISTS `projects`')
    await queryRunner.query('DROP TABLE IF EXISTS `products`')
    await queryRunner.query('DROP TABLE IF EXISTS `product_categories`')
    await queryRunner.query('DROP TABLE IF EXISTS `login_attempts`')
    await queryRunner.query('DROP TABLE IF EXISTS `refresh_tokens`')
    await queryRunner.query('DROP TABLE IF EXISTS `users`')
  }
}
