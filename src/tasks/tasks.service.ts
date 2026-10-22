import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './task-status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const task = this.tasksRepository.create({
      id: randomUUID(),
      title: createTaskDto.title,
      description: createTaskDto.description ?? null,
      status: createTaskDto.status ?? TaskStatus.TODO,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(query: ListTasksQueryDto): Promise<{
    data: TaskEntity[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = query.status ? { status: query.status } : {};
    const [data, total] = await this.tasksRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} was not found.`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    const existingTask = await this.tasksRepository.preload({ id, ...updateTaskDto });
    if (!existingTask) {
      throw new NotFoundException(`Task ${id} was not found.`);
    }
    return this.tasksRepository.save(existingTask);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task ${id} was not found.`);
    }
  }
}
