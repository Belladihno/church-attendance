import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDepartmentNullable20260910183102 implements MigrationInterface {
  name = 'MakeDepartmentNullable20260910183102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" SET NOT NULL`);
  }
}
