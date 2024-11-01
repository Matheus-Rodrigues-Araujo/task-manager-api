import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async get(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task | null> {
    try {
      return await this.prisma.task.findUnique({
        where: taskWhereUniqueInput,
      });
    } catch (error) {
      console.log('Erro na busca da tarefa', error);
      throw new Error('Tarefa não encontrada');
    }
  }

  async findAll(): Promise<Task[] | null> {
    try {
      return await this.prisma.task.findMany();
    } catch (error) {
      console.log('Erro na busca das tarefas', error);
      throw new Error('Tarefas não encontradas');
    }
  }

  async create(
    data: Prisma.TaskCreateInput,
  ): Promise<Omit<Task, 'order'> | null> {
    try {
      return await this.prisma.task.create({ data });
    } catch (error) {
      console.log('Erro na criação da tarefa', error);
      throw new Error('Não foi possível criar a tarefa');
    }
  }

  async update(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Omit<Prisma.TaskUpdateInput, 'order'>;
  }): Promise<Task | null> {
    try {
      const { where, data } = params;
      const nameExists: Task | null = await this.prisma.task.findUnique({
        where: { name: <string>data.name },
      });

      if (!nameExists) return this.prisma.task.update({ data, where });
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
      throw new Error('Tarefa não foi atualizada');
    }
  }

  async delete(where: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    try {
      return await this.prisma.task.delete({ where });
    } catch (error) {
      console.error('Erro ao deletar tarefa', error);
      throw new Error('Tarefa não foi deletada');
    }
  }
}
