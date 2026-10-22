import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1700000000000 implements MigrationInterface {
  name = 'CreateTasksTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL,
        "title" character varying(200) NOT NULL,
        "description" text,
        "status" character varying(20) NOT NULL DEFAULT 'todo',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_tasks_status" CHECK ("status" IN ('todo', 'in_progress', 'done'))
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_tasks_created_at" ON "tasks" ("created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_created_at"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
  }
}
