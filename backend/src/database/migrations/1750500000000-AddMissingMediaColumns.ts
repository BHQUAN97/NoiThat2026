import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Production media table thieu nhieu columns vi CREATE TABLE IF NOT EXISTS
 * trong migration truoc skip khi table da ton tai voi schema cu.
 * Them tat ca columns ma entity can nhung table cu chua co.
 */
export class AddMissingMediaColumns1750500000000 implements MigrationInterface {
  name = 'AddMissingMediaColumns1750500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = await queryRunner.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'media'`,
    )
    const existing = new Set(columns.map((c: any) => c.COLUMN_NAME))

    const additions: Array<{ name: string; sql: string }> = [
      { name: 'thumbnail_url', sql: `\`thumbnail_url\` varchar(500) NULL AFTER \`original_url\`` },
      { name: 'preview_url', sql: `\`preview_url\` varchar(500) NULL AFTER \`thumbnail_url\`` },
      { name: 'width', sql: `\`width\` int unsigned NULL AFTER \`preview_url\`` },
      { name: 'height', sql: `\`height\` int unsigned NULL AFTER \`width\`` },
      { name: 'alt_text', sql: `\`alt_text\` varchar(255) NULL AFTER \`height\`` },
      { name: 'blurhash', sql: `\`blurhash\` varchar(100) NULL AFTER \`alt_text\`` },
      { name: 'processing_status', sql: `\`processing_status\` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending' AFTER \`blurhash\`` },
      { name: 'processing_error', sql: `\`processing_error\` text NULL AFTER \`processing_status\`` },
      { name: 'deleted_at', sql: `\`deleted_at\` timestamp NULL AFTER \`created_at\`` },
    ]

    for (const col of additions) {
      if (!existing.has(col.name)) {
        await queryRunner.query(`ALTER TABLE \`media\` ADD COLUMN ${col.sql}`)
      }
    }

    // Index cho deleted_at (soft delete queries)
    const indexes = await queryRunner.query(
      `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'media' AND INDEX_NAME = 'IDX_media_deleted_at'`,
    )
    if (indexes.length === 0 && existing.has('deleted_at') || !existing.has('deleted_at')) {
      try {
        await queryRunner.query(`CREATE INDEX \`IDX_media_deleted_at\` ON \`media\` (\`deleted_at\`)`)
      } catch { /* index may already exist */ }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dropCols = ['deleted_at', 'processing_error', 'processing_status', 'blurhash', 'alt_text', 'height', 'width', 'preview_url', 'thumbnail_url']
    for (const col of dropCols) {
      await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN IF EXISTS \`${col}\``)
    }
    try {
      await queryRunner.query(`DROP INDEX \`IDX_media_deleted_at\` ON \`media\``)
    } catch { /* index may not exist */ }
  }
}
