import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
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
    try {
      return this.taskService.findAll();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Tarefas não encontradas' },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string): Promise<Task> {
    try {
      const task = await this.taskService.get({ id: Number(id) });
      
      if (!task) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Tarefa não encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }

      return task;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Tarefa não encontrada',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() task: { name: string; price: number; endDate: Date },
  ): Promise<Omit<Task, 'order'>> {
    try {
      return await this.taskService.create(task);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erro ao criar tarefa',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: { name: string; price: number; endDate: Date },
  ): Promise<Task> {
    try {
      const task = await this.taskService.update({ where: { id: Number(id) }, data });

      if (!task) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Tarefa não encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return task;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Tarefa não atualizada',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<Task> {
    try {
      const task = await this.taskService.delete({ id: Number(id) });

      if (!task) {
        throw new HttpException(
          {
            error: 'Tarefa não encontrada',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return task;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erro ao deletar tarefa',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
