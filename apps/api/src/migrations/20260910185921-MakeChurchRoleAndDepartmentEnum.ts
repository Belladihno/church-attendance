import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeChurchRoleAndDepartmentEnum20260910185921 implements MigrationInterface {
  name = 'MakeChurchRoleAndDepartmentEnum20260910185921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Normalize existing data to new enum values before altering column type
    await queryRunner.query(`UPDATE "members" SET "church_role" = 'MEMBER' WHERE "church_role" = 'Member'`);
    await queryRunner.query(`UPDATE "members" SET "church_role" = 'DEACONESS' WHERE "church_role" = 'Deaconess'`);
    await queryRunner.query(`UPDATE "members" SET "church_role" = 'WORKER' WHERE "church_role" IN ('Worker', 'Chorister')`);
    // Any other existing roles not in new enum map to MEMBER
    await queryRunner.query(`UPDATE "members" SET "church_role" = 'MEMBER' WHERE "church_role" NOT IN ('MEMBER','WORKER','MEN_LEADER','WOMEN_LEADER','YOUTH_LEADER','DEACON','DEACONESS','ASSISTANT_PASTOR','PASTOR')`);

    await queryRunner.query(`UPDATE "members" SET "department" = 'CHOIR' WHERE "department" = 'Choir'`);
    await queryRunner.query(`UPDATE "members" SET "department" = 'USHERING' WHERE "department" IN ('Ushering', 'Ushering Unit')`);
    await queryRunner.query(`UPDATE "members" SET "department" = 'NONE' WHERE "department" = 'Congregation' OR "department" IS NULL`);
    await queryRunner.query(`UPDATE "members" SET "department" = 'NONE' WHERE "department" NOT IN ('NONE','CHOIR','USHERING','CHILDREN_MINISTRY','YOUTH_MINISTRY','PRAYER_TEAM','TECHNICAL','WELFARE','PROTOCOL','WORKERS_IN_TRAINING')`);

    // Create new enum types
    await queryRunner.query(`CREATE TYPE "public"."members_church_role_enum" AS ENUM('MEMBER','WORKER','MEN_LEADER','WOMEN_LEADER','YOUTH_LEADER','DEACON','DEACONESS','ASSISTANT_PASTOR','PASTOR')`);
    await queryRunner.query(`CREATE TYPE "public"."members_department_enum" AS ENUM('NONE','CHOIR','USHERING','CHILDREN_MINISTRY','YOUTH_MINISTRY','PRAYER_TEAM','TECHNICAL','WELFARE','PROTOCOL','WORKERS_IN_TRAINING')`);

    // Alter columns to use new enums
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "church_role" TYPE "public"."members_church_role_enum" USING "church_role"::"public"."members_church_role_enum"`);
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" TYPE "public"."members_department_enum" USING "department"::"public"."members_department_enum"`);
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" SET DEFAULT 'NONE'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "department" TYPE varchar USING "department"::text`);
    await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "church_role" TYPE varchar USING "church_role"::text`);
    await queryRunner.query(`DROP TYPE "public"."members_department_enum"`);
    await queryRunner.query(`DROP TYPE "public"."members_church_role_enum"`);
  }
}
