import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task.' })
  @ApiCreatedResponse({ description: 'The task was created.' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks with pagination and optional status filtering.' })
  @ApiOkResponse({ description: 'A paginated list of tasks.' })
  findAll(@Query() query: ListTasksQueryDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one task by UUID.' })
  @ApiOkResponse({ description: 'The requested task.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<TaskEntity> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task.' })
  @ApiOkResponse({ description: 'The updated task.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task.' })
  @ApiNoContentResponse({ description: 'The task was deleted.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}
