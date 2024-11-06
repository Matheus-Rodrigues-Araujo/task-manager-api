import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async get(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });
    if (!task)
      throw new NotFoundException(
        `Tarefa com Id:${taskWhereUniqueInput.id} não existe`,
      );
    return task;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    if (!tasks) throw new NotFoundException('Tarefas não encontradas');
    return tasks;
  }

  async create(data: Prisma.TaskCreateInput): Promise<Omit<Task, 'order'>> {
    if (!data) throw new NotFoundException('Preencha os dados!');
    const nameExists: Task | null = await this.prisma.task.findUnique({
      where: { name: data.name },
    });

    if (nameExists) throw new ConflictException('Nome já utilizado!');

    const task = await this.prisma.task.create({ data });
    if (!task) throw new BadRequestException('Tarefa não foi criada');
    return task;
  }

  async update(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Omit<Prisma.TaskUpdateInput, 'order'>;
  }): Promise<Task> {
    const { where, data } = params;

    if (!data) throw new NotFoundException('Preencha os dados!');

    const nameExists: Task | null = await this.prisma.task.findUnique({
      where: { name: <string>data.name },
    });
    if (nameExists) throw new ConflictException('Nome já utilizado!');

    const updatedTask = this.prisma.task.update({ data, where });
    if (!updatedTask) throw new BadRequestException('Tarefa não atualizada');
    return updatedTask;
  }

  async updateOrder(tasks: Task[]): Promise<Task[]> {
    if (!tasks) throw new NotFoundException('Tarefas não encontradas!');

    const updatePromises = tasks.map((task) => {
      return this.prisma.task.update({
        where: { id: task.id },
        data: { order: task.order },
      });
    });

    if (!updatePromises)
      throw new BadRequestException('Tarefas não puderam ser ordenadas!');

    return await Promise.all(updatePromises);
  }

  async delete(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    try {
      const deletedTask = await this.prisma.task.delete({ where });
      return deletedTask;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Tarefa não foi deletada. Registro não encontrado.',
          );
        }
      }
      throw new InternalServerErrorException(
        'Erro ao tentar deletar a tarefa.',
      );
    }
  }
}
