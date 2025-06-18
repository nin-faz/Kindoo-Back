import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly s_usersService: UsersService) {}

  /**
   * Crée un nouvel utilisateur.
   * @param p_createUserInput - Input contenant les détails de l'utilisateur à créer.
   * @returns L'utilisateur créé.
   */
  @Mutation(() => User)
  async createUser(@Args('p_createUserInput') p_createUserInput: CreateUserInput): Promise<User> {
    return this.s_usersService.create(p_createUserInput);
  }

  /**
   * Récupère tous les utilisateurs.
   * @returns La liste de tous les utilisateurs.
   */
  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.s_usersService.findAll();
  }

  /**
   * Récupère un utilisateur par son ID.
   * @param p_id - L'ID de l'utilisateur à récupérer.
   * @returns L'utilisateur correspondant ou null si il n'existe pas.
   */
  @Query(() => User)
  async findOne(@Args('p_username', { type: () => String }) p_username: string): Promise<User | null> {
    return this.s_usersService.findOne(p_username);
  }

  @Query(() => User, { name: 'findOneById' })
  async findOneById(@Args('p_id', { type: () => String }) p_id: string): Promise<User | null> {
    return this.s_usersService.findOneById(p_id);
  }

  /**
   * Met à jour un utilisateur.
   * @param p_updateUserInput - Input contenant les détails de l'utilisateur à mettre à jour.
   * @param p_id - L'ID de l'utilisateur à mettre à jour.
   * @returns L'utilisateur mis à jour.
   */
  @Mutation(() => User)
  async updateUser(
    @Args('p_updateUserInput') p_updateUserInput: UpdateUserInput,
    @Args('p_id') p_id: string,
  ): Promise<User> {
    return this.s_usersService.update(p_id, p_updateUserInput);
  }

  /**
   * Supprime un utilisateur.
   * @param p_id - L'ID de l'utilisateur à supprimer.
   * @returns Un message de confirmation de la suppression.
   */
  @Mutation(() => String)
  async removeUser(@Args('p_id', { type: () => String }) p_id: string): Promise<string> {
    return this.s_usersService.remove(p_id);
  }
}
