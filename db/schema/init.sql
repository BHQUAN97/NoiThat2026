-- NoiThat2026 — Database Initialization
-- MySQL Docker entrypoint tự tạo MYSQL_DATABASE và MYSQL_USER từ env vars
-- File này chỉ cần grant thêm permissions nếu cần
-- Schema được tạo bởi TypeORM migrations: npm run migration:run

-- Ensure UTF8MB4 collation
ALTER DATABASE noithat2026 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges (đã được tạo bởi MYSQL_USER env var, grant thêm để chắc chắn)
GRANT ALL PRIVILEGES ON noithat2026.* TO 'noithat'@'%';
FLUSH PRIVILEGES;
