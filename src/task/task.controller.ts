import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Patch,
  Body,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async all(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string): Promise<Task> {
    return await this.taskService.get({ id: Number(id) });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() task: { name: string; price: number; endDate: Date },
  ): Promise<Omit<Task, 'order'>> {
    return await this.taskService.create(task);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: { name: string; price: number; endDate: Date },
  ): Promise<Task> {
    return await this.taskService.update({ where: { id: Number(id) }, data });
  }

  @Patch('order')
  @HttpCode(HttpStatus.OK)
  async updateOrder(@Body() tasks: Task[]) {
    return await this.taskService.updateOrder(tasks);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.taskService.delete({ id: Number(id) });
  }
}
