import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPricingDetailUrl1750600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE pricing_tables ADD COLUMN detail_url VARCHAR(500) NULL AFTER items`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE pricing_tables DROP COLUMN detail_url`,
    )
  }
}
