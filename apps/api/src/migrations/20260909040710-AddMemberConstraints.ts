import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMemberConstraints20260909040710 implements MigrationInterface {
  name = 'AddMemberConstraints20260909040710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Unique phone to prevent duplicate member race (TOCTOU)
    await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "UQ_members_phone" UNIQUE ("phone")`);
    // Optimistic locking version
    await queryRunner.query(`ALTER TABLE "members" ADD "version" integer NOT NULL DEFAULT 1`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "UQ_members_phone"`);
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "version"`);
  }
}
