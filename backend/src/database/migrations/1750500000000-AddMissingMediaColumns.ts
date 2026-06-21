import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Production media table thieu thumbnail_url va preview_url
 * vi CREATE TABLE IF NOT EXISTS trong migration truoc skip khi table da ton tai.
 */
export class AddMissingMediaColumns1750500000000 implements MigrationInterface {
  name = 'AddMissingMediaColumns1750500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Kiem tra column ton tai truoc khi ADD — tranh loi khi chay tren DB da co du column
    const columns = await queryRunner.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'media'`,
    )
    const columnNames = columns.map((c: any) => c.COLUMN_NAME)

    if (!columnNames.includes('thumbnail_url')) {
      await queryRunner.query(
        `ALTER TABLE \`media\` ADD COLUMN \`thumbnail_url\` varchar(500) NULL AFTER \`original_url\``,
      )
    }

    if (!columnNames.includes('preview_url')) {
      await queryRunner.query(
        `ALTER TABLE \`media\` ADD COLUMN \`preview_url\` varchar(500) NULL AFTER \`thumbnail_url\``,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN IF EXISTS \`preview_url\``)
    await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN IF EXISTS \`thumbnail_url\``)
  }
}
