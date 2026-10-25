import "dotenv/config";
import { DataSource } from "typeorm";
import { TaskEntity } from "../tasks/entities/task.entity";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? "taskflow",
  password: process.env.DB_PASSWORD ?? "change_me_local_only",
  database: process.env.DB_DATABASE ?? "taskflow",
  entities: [TaskEntity],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: false,
  logging: process.env.DB_LOGGING === "true",
  ssl:
    process.env.PGSSLMODE === "no-verify"
      ? { rejectUnauthorized: false }
      : undefined,
});

export default dataSource;
