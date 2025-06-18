import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateConversationInput } from './dto/create-conversation.input';
import { Conversation } from './entities/conversation.entity';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ConversationService {
  private readonly s_prismaService: PrismaService;

  constructor(
    private readonly s_usersService: UsersService,
    p_prismaService: PrismaService,
    private readonly s_eventEmitter: EventEmitter2
  ) {
    this.s_prismaService = p_prismaService;
  }

  /**
   * Crée une nouvelle conversation avec les participants.
   * @param p_createConversationInput - Input contenant les IDs des participants.
   * @returns La conversation créée.
   */
  async create(p_createConversationInput: CreateConversationInput): Promise<Conversation> {
    const v_participantIds = p_createConversationInput.participantIds;

    const v_foundUsers = await Promise.all(
      v_participantIds.map((p_id) => this.s_usersService.findOneById(p_id)),// On peut mettre findByUsername si on veut
    );

    const v_validUsers = v_foundUsers.filter((u) => u !== null);
    if (v_validUsers.length !== v_participantIds.length) {
      throw new NotFoundException('Un ou plusieurs utilisateurs introuvables');
    }

    const conversation = await this.s_prismaService.conversation.create({
      data: {
        participants: {
          connect: v_participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: true,
      },
    });

    // Émettre un événement lors de la création
    this.s_eventEmitter.emit('conversation.created', conversation);

    return conversation;
  }

  /**
   * Récupère toutes les conversations.
   * @returns La liste de toutes les conversations.
   */
  findAll(): Promise<Conversation[]> {
    return this.s_prismaService.conversation.findMany({
      include: { participants: true },
    });
  }

  /**
   * Récupère une conversation par son ID.
   * @param p_id - L'ID de la conversation à récupérer.
   * @returns La conversation correspondante ou null si elle n'existe pas.
   */
  findOne(p_id: string): Promise<Conversation | null> {
    return this.s_prismaService.conversation.findUnique({
      where: { id: p_id },
      include: { participants: true },
    });
  }

  /**
   * Récupère les conversations d'un participant par son ID.
   * @param p_participantId - L'ID du participant.
   * @returns La liste des conversations auxquelles le participant participe.
   */
  findByParticipantId(p_participantId: string): Promise<Conversation[]> {
    return this.s_prismaService.conversation.findMany({
      where: {
        participants: {
          some: { id: p_participantId },
        },
      },
      include: { participants: true },
    });
  }

  /**
   * Récupère une conversation par les IDs de ses participants.
   * @param p_userIds - Liste des IDs des participants.
   * @returns La conversation correspondante ou null si elle n'existe pas.
   */
  async findByParticipants(p_userIds: string[]): Promise<Conversation | null> {
    const conversations = await this.s_prismaService.conversation.findMany({
      include: { participants: true },
    });

    const v_found = conversations.find(
      (conv) =>
        conv.participants.length === p_userIds.length &&
        conv.participants.every((p) => p_userIds.includes(p.id))
    );
    return v_found ?? null;
  }
}