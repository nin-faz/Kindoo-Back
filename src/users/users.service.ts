import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private e_users: User[] = [];
  private v_count: number = 0;
  
  create(p_createUserInput: CreateUserInput) {
  
    const v_userCreated = this.e_users.push({
      username: p_createUserInput.userName,
      id: `${this.v_count}`,
      createdAt: new Date(),
      password: p_createUserInput.password
    });
    this.v_count++;

    return `User created : ${v_userCreated}`;
  }

  findAll() {
    return this.e_users;
  }

  findOne(p_id: string) {
    return this.e_users.find(user => user.id === p_id);
  }

  update(p_id: string, p_updateUserInput: UpdateUserInput) {
    const v_userIndex = this.e_users.findIndex((user) => user.id === p_id);
    if (v_userIndex === -1) {
      throw new NotFoundException(`User with ID ${p_id} not found`);
    }

    const v_userUpdated = this.e_users[v_userIndex] = { ...this.e_users[v_userIndex], ...p_updateUserInput}
    return `User updated : ${v_userUpdated}`
}

remove(p_id: string) {
  const v_userIndex = this.e_users.findIndex(user => user.id === p_id);
  if (v_userIndex === -1) {
    throw new NotFoundException(`User with ID ${p_id} not found`);
  }
  const v_deletedUser = this.e_users.splice(v_userIndex, 1)[0];
  return `User removed: ${v_deletedUser.username}`;
}
}


