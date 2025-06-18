import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly s_usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') p_createUserInput: CreateUserInput): Promise<User> {
    return this.s_usersService.create(p_createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.s_usersService.findAll();
  }


  @Query(() => User)
  async findOne(@Args('p_username', { type: () => String }) p_username: string): Promise<User | null> {
    return this.s_usersService.findOne(p_username);
  }

  @Query(() => User, { name: 'findOneById' })
  async findOneById(@Args('p_id', { type: () => String }) p_id: string): Promise<User | null> {
    return this.s_usersService.findOneById(p_id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('p_updateUserInput') p_updateUserInput: UpdateUserInput,
    @Args('p_id') p_id: string,
  ): Promise<User> {
    return this.s_usersService.update(p_id, p_updateUserInput);
  }

  @Mutation(() => String)
  async removeUser(@Args('p_id', { type: () => String }) p_id: string): Promise<string> {
    return this.s_usersService.remove(p_id);
  }
}
