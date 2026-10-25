import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthModule } from "./health/health.module";
import { TaskEntity } from "./tasks/entities/task.entity";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres" as const,
        host: configService.get<string>("DB_HOST", "localhost"),
        port: Number(configService.get<string>("DB_PORT", "5432")),
        username: configService.get<string>("DB_USERNAME", "taskflow"),
        password: configService.get<string>(
          "DB_PASSWORD",
          "change_me_local_only",
        ),
        database: configService.get<string>("DB_DATABASE", "taskflow"),
        entities: [TaskEntity],
        migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
        synchronize: false,
        migrationsRun: false,
        retryAttempts: 5,
        retryDelay: 3000,
        logging: configService.get<string>("DB_LOGGING", "false") === "true",
        ssl:
          configService.get<string>("PGSSLMODE") === "no-verify"
            ? { rejectUnauthorized: false }
            : undefined,
      }),
    }),
    HealthModule,
    TasksModule,
  ],
})
export class AppModule {}
