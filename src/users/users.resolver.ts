import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly s_usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') p_createUserInput: CreateUserInput) {
    return this.s_usersService.create(p_createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.s_usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('p_id', { type: () => String }) p_id: string) {
    return this.s_usersService.findOne(p_id);
  }

  @Mutation(() => User)
  updateUser(@Args('p_updateUserInput') p_updateUserInput: UpdateUserInput, @Args('p_id') p_id: string) {
    return this.s_usersService.update(p_id, p_updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('p_id', { type: () => String }) p_id: string) {
    return this.s_usersService.remove(p_id);
  }
}
