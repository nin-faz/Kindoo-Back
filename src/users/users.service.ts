import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private e_users: User[] = [];

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];
  
  private v_count: number = 0;
  
  create(p_createUserInput: CreateUserInput): User {
    const saltOrRounds = 10;
    const v_password = bcrypt.hashSync(p_createUserInput.password, saltOrRounds);
    const v_userCreated: User = {
      userName: p_createUserInput.userName,
      id: `${this.v_count}`,
      createdAt: new Date(),
      password: v_password
    };
    this.e_users.push(v_userCreated);
    this.v_count++;
    return v_userCreated;
  }

  findAll() {
    return this.e_users;
  }

  findOne(username: string) {
    return this.e_users.find((user) => user.userName === username);
  }

  findOneById(p_id: string) {
    return this.e_users.find((user) => user.id === p_id);
  }

  update(p_id: string, p_updateUserInput: UpdateUserInput): User {
    const v_userIndex = this.e_users.findIndex((user) => user.id === p_id);
    if (v_userIndex === -1) {
      throw new NotFoundException(`User with ID ${p_id} not found`);
    }
    const oldUser = this.e_users[v_userIndex];
    const updatedUser: User = {
      ...oldUser,
      userName: p_updateUserInput.userName ?? oldUser.userName,
      password: p_updateUserInput.password ?? oldUser.password,
      id: oldUser.id,
      createdAt: oldUser.createdAt
    };
    this.e_users[v_userIndex] = updatedUser;
    return updatedUser;
  }

  remove(p_id: string) {
    const v_userIndex = this.e_users.findIndex((user) => user.id === p_id);
    if (v_userIndex === -1) {
      throw new NotFoundException(`User with ID ${p_id} not found`);
    }
    const v_deletedUser = this.e_users.splice(v_userIndex, 1)[0];
    return `User removed: ${v_deletedUser.userName}`;
  }
}

