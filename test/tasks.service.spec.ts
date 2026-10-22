import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';
import { ListTasksQueryDto } from '../src/tasks/dto/list-tasks-query.dto';
import { TaskEntity } from '../src/tasks/entities/task.entity';
import { TaskStatus } from '../src/tasks/task-status';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<TaskEntity>>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<TaskEntity>>;

    service = new TasksService(repository);
  });

  it('creates a task with a generated UUID and default status', async () => {
    const dto: CreateTaskDto = { title: 'Deploy API' };
    const createdTask = {
      id: '9e3b2f1a-8f37-4a9f-a942-ae8a820d9123',
      title: 'Deploy API',
      description: null,
      status: TaskStatus.TODO,
    } as TaskEntity;
    repository.create.mockReturnValue(createdTask);
    repository.save.mockResolvedValue(createdTask);

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Deploy API',
        description: null,
        status: TaskStatus.TODO,
        id: expect.any(String),
      }),
    );
    expect(result).toBe(createdTask);
  });

  it('returns paginated tasks and total count', async () => {
    const query = Object.assign(new ListTasksQueryDto(), { page: 2, limit: 10 });
    const rows = [{ id: 'task-1' }] as TaskEntity[];
    repository.findAndCount.mockResolvedValue([rows, 21]);

    const result = await service.findAll(query);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      order: { createdAt: 'DESC' },
      skip: 10,
      take: 10,
    });
    expect(result.pagination).toEqual({ page: 2, limit: 10, total: 21, totalPages: 3 });
    expect(result.data).toBe(rows);
  });

  it('throws NotFoundException if a task does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('9e3b2f1a-8f37-4a9f-a942-ae8a820d9123')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
