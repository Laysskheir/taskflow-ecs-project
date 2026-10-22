import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe: confirms the HTTP process is responding.' })
  @ApiResponse({ status: 200, description: 'The API process is alive.' })
  live(): { status: string; service: string; timestamp: string } {
    return {
      status: 'ok',
      service: 'taskflow-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe: confirms the API can reach PostgreSQL.' })
  @ApiResponse({ status: 200, description: 'The API is ready to receive traffic.' })
  @ApiResponse({ status: 503, description: 'A required dependency is unavailable.' })
  async ready(): Promise<{ status: string; dependencies: { database: string } }> {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ready', dependencies: { database: 'up' } };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        dependencies: { database: 'down' },
      });
    }
  }
}
