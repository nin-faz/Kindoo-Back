import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly s_prismaService: PrismaService;
  
  private v_count: number = 0;

  constructor(p_prismaService: PrismaService) {
    this.s_prismaService = p_prismaService;
  }

  /**
   * Crée un nouvel utilisateur avec un mot de passe haché.
   * @param p_createUserInput - Input contenant les détails de l'utilisateur.
   * @returns L'utilisateur créé.
   */
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

  /**
   * Récupère tous les utilisateurs.
   * @returns La liste de tous les utilisateurs.
   */
  findAll(): Promise<User[]> {
    return this.s_prismaService.user.findMany();
  }

  /**
   * Récupère un utilisateur par son nom d'utilisateur.
   * @param p_username - Le nom d'utilisateur de l'utilisateur à récupérer.
   * @returns L'utilisateur correspondant ou null si il n'existe pas.
   */
  findOne(p_username: string) : Promise<User | null> {
    return this.s_prismaService.user.findUnique({
      where: { userName: p_username },
    });
  }

  /**
   * Récupère un utilisateur par son ID.
   * @param p_id - L'ID de l'utilisateur à récupérer.
   * @returns L'utilisateur correspondant ou null si il n'existe pas.
   */
  async findOneById(p_id: string): Promise<User | null> {
    return this.s_prismaService.user.findUnique({
      where: { id: p_id },
    });
  }

  /**
   * Met à jour un utilisateur par son ID.
   * @param p_id - L'ID de l'utilisateur à mettre à jour.
   * @param p_updateUserInput - Input contenant les détails de l'utilisateur à mettre à jour.
   * @returns L'utilisateur mis à jour.
   */
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

  /**
   * Supprime un utilisateur par son ID.
   * @param p_id - L'ID de l'utilisateur à supprimer.
   * @returns Un message de confirmation de la suppression.
   **/
  async remove(p_id: string): Promise<string> {
    const v_deleted = await this.s_prismaService.user.delete({
      where: { id: p_id },
    });
    return `User removed: ${v_deleted.userName}`;
  }
}

