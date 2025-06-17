import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { username: string; password: string }) {
    return this.usersService.create({
      userName: body.username,
      password: body.password,
    });
  }
}
