import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260909032327 implements MigrationInterface {
  name = 'InitialSchema20260909032327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Enums
    await queryRunner.query(`CREATE TYPE "public"."gender_enum" AS ENUM('MALE', 'FEMALE')`);
    await queryRunner.query(`CREATE TYPE "public"."member_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(`CREATE TYPE "public"."attendance_status_enum" AS ENUM('PRESENT', 'ABSENT', 'EXCUSED')`);
    await queryRunner.query(`CREATE TYPE "public"."service_type_enum" AS ENUM('SUNDAY_SCHOOL', 'SUNDAY_SERVICE')`);
    await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'STAFF')`);
    await queryRunner.query(`CREATE TYPE "public"."follow_up_status_enum" AS ENUM('PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED')`);
    await queryRunner.query(`CREATE TYPE "public"."first_timer_follow_up_status_enum" AS ENUM('PENDING', 'CONTACTED', 'CONVERTED', 'CLOSED')`);

    // users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "role" "public"."user_role_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // members
    await queryRunner.query(`
      CREATE TABLE "members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "phone" varchar NOT NULL,
        "gender" "public"."gender_enum" NOT NULL,
        "address" text NOT NULL,
        "church_role" varchar NOT NULL,
        "department" varchar NOT NULL,
        "sunday_school_class" varchar,
        "status" "public"."member_status_enum" NOT NULL,
        "date_joined" date NOT NULL,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_members" PRIMARY KEY ("id")
      )
    `);

    // first_timers
    await queryRunner.query(`
      CREATE TABLE "first_timers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "phone" varchar NOT NULL,
        "gender" "public"."gender_enum" NOT NULL,
        "address" text,
        "date_attended" date NOT NULL,
        "service_attended" "public"."service_type_enum" NOT NULL,
        "invited_by" varchar,
        "how_heard" varchar,
        "follow_up_status" "public"."first_timer_follow_up_status_enum" NOT NULL DEFAULT 'PENDING',
        "follow_up_notes" text,
        "converted_to_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_first_timers" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "first_timers"
      ADD CONSTRAINT "FK_first_timers_converted_to_id"
      FOREIGN KEY ("converted_to_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE
    `);

    // attendances
    await queryRunner.query(`
      CREATE TABLE "attendances" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "member_id" uuid NOT NULL,
        "date" date NOT NULL,
        "service_type" "public"."service_type_enum" NOT NULL,
        "status" "public"."attendance_status_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_attendances" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "attendances"
      ADD CONSTRAINT "FK_attendances_member_id"
      FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "attendances"
      ADD CONSTRAINT "UQ_attendance_member_date_service" UNIQUE ("member_id", "date", "service_type")
    `);

    // follow_ups
    await queryRunner.query(`
      CREATE TABLE "follow_ups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "member_id" uuid,
        "first_timer_id" uuid,
        "reason" varchar NOT NULL,
        "assigned_to" varchar,
        "status" "public"."follow_up_status_enum" NOT NULL DEFAULT 'PENDING',
        "contact_date" date,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_follow_ups" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "follow_ups"
      ADD CONSTRAINT "FK_follow_ups_member_id"
      FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "follow_ups"
      ADD CONSTRAINT "FK_follow_ups_first_timer_id"
      FOREIGN KEY ("first_timer_id") REFERENCES "first_timers"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "follow_ups" DROP CONSTRAINT "FK_follow_ups_first_timer_id"`);
    await queryRunner.query(`ALTER TABLE "follow_ups" DROP CONSTRAINT "FK_follow_ups_member_id"`);
    await queryRunner.query(`DROP TABLE "follow_ups"`);

    await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "UQ_attendance_member_date_service"`);
    await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_attendances_member_id"`);
    await queryRunner.query(`DROP TABLE "attendances"`);

    await queryRunner.query(`ALTER TABLE "first_timers" DROP CONSTRAINT "FK_first_timers_converted_to_id"`);
    await queryRunner.query(`DROP TABLE "first_timers"`);
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "public"."first_timer_follow_up_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."follow_up_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."service_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."attendance_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."member_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."gender_enum"`);
  }
}
