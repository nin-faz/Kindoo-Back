import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly s_prismaService: PrismaService;

  private e_users: User[] = [];
  
  private v_count: number = 0;

  constructor(p_prismaService: PrismaService) {
    this.s_prismaService = p_prismaService;
  }

  async create(p_createUserInput: CreateUserInput): Promise<User> {
    const s_saltOrRounds = 10;
    const s_hashedPassword = bcrypt.hashSync(p_createUserInput.password, s_saltOrRounds);

    return this.s_prismaService.user.create({
      data: {
        userName: p_createUserInput.userName,
        password: s_hashedPassword,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.s_prismaService.user.findMany();
  }

  findOne(p_username: string) : Promise<User | null> {
    return this.s_prismaService.user.findUnique({
      where: { userName: p_username },
    });
  }

  async findOneById(p_id: string): Promise<User | null> {
    return this.s_prismaService.user.findUnique({
      where: { id: p_id },
    });
  }

  async update(p_id: string, p_updateUserInput: UpdateUserInput): Promise<User> {
    const v_existing = await this.s_prismaService.user.findUnique({ where: { id: p_id } });
    if (!v_existing) throw new NotFoundException(`User with ID ${p_id} not found`);

    return this.s_prismaService.user.update({
      where: { id: p_id },
      data: {
        userName: p_updateUserInput.userName ?? v_existing.userName,
        password: p_updateUserInput.password ?? v_existing.password,
      },
    });
  }

  async remove(p_id: string): Promise<string> {
    const v_deleted = await this.s_prismaService.user.delete({
      where: { id: p_id },
    });
    return `User removed: ${v_deleted.userName}`;
  }
}

