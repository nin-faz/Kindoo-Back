import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from './entities/conversation.entity';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ConversationService {
  private e_conversation: Conversation[] = [];
  private readonly s_prismaService: PrismaService;

  constructor( private readonly usersService: UsersService, p_prismaService: PrismaService) {
    this.s_prismaService = p_prismaService;
  }

  private findUserById(userId: string) {
    for (const v_conv of this.e_conversation) {
      const user = v_conv.participants.find((p) => p.id === userId);
      if (user) return user;
    }
    return null;
  }

  async create(p_createConversationInput: CreateConversationInput): Promise<Conversation> {
    const v_participantIds = p_createConversationInput.participantIds;

    const v_foundUsers = await Promise.all(
      v_participantIds.map((id) => this.usersService.findOneById(id)),// On peut mettre findByUsername si on veut
    );

    const v_validUsers = v_foundUsers.filter((u) => u !== null);
    if (v_validUsers.length !== v_participantIds.length) {
      throw new NotFoundException('Un ou plusieurs utilisateurs introuvables');
    }

    return this.s_prismaService.conversation.create({
      data: {
        participants: {
          connect: v_participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: true,
      },
    });
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

    const v_found = conversations.find((conv) =>
      conv.participants.length === p_userIds.length &&
      conv.participants.every((p) => p_userIds.includes(p.id)),
    );
    return v_found ?? null;
  }
}
