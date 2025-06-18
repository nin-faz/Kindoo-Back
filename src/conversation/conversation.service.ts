import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateConversationInput } from './dto/create-conversation.input';
import { Conversation } from './entities/conversation.entity';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ConversationService {
  private e_conversation: Conversation[] = [];
  private readonly s_prismaService: PrismaService;

  constructor(
    private readonly usersService: UsersService,
    p_prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.s_prismaService = p_prismaService;
  }

  async create(
    p_createConversationInput: CreateConversationInput
  ): Promise<Conversation> {
    const v_participantIds = p_createConversationInput.participantIds;

    const v_foundUsers = await Promise.all(
      v_participantIds.map((id) => this.usersService.findOneById(id))
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
    this.eventEmitter.emit('conversation.created', conversation);

    return conversation;
  }

  findAll(): Promise<Conversation[]> {
    return this.s_prismaService.conversation.findMany({
      include: { participants: true },
    });
  }

  findOne(p_id: string): Promise<Conversation | null> {
    return this.s_prismaService.conversation.findUnique({
      where: { id: p_id },
      include: { participants: true },
    });
  }

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
