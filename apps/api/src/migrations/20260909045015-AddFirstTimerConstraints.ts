import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstTimerConstraints20260909045015 implements MigrationInterface {
  name = 'AddFirstTimerConstraints20260909045015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "first_timers" ADD CONSTRAINT "UQ_first_timers_phone_date" UNIQUE ("phone", "date_attended")`);
    await queryRunner.query(`ALTER TABLE "first_timers" ADD "version" integer NOT NULL DEFAULT 1`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "first_timers" DROP CONSTRAINT "UQ_first_timers_phone_date"`);
    await queryRunner.query(`ALTER TABLE "first_timers" DROP COLUMN "version"`);
  }
}
