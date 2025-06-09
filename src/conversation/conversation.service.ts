import { Injectable } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from './entities/conversation.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConversationService {
  private e_conversation: Conversation[] = [];

  constructor( private readonly usersService: UsersService) {}

  private findUserById(userId: string) {
    for (const conv of this.e_conversation) {
      const user = conv.participants.find((p) => p.id === userId);
      if (user) return user;
    }
    return null;
  }

  async create(p_createConversationInput: CreateConversationInput) {
    // Pour chaque participant, récupère toutes les infos si elles existent déjà
    const v_participants = (
      await Promise.all(
        p_createConversationInput.participantIds.map(async (id) => {
          const existing = await this.usersService.findOneById(id);
          return existing ? { ...existing } : null;
        }),
      )
    ).filter((participant) => participant !== null);

    const v_newConversation: Conversation = {
      id: uuidv4(),
      createdAt: new Date(),
      participants: v_participants,
    };
    this.e_conversation.push(v_newConversation);
    return v_newConversation;
  }

  findAll(): Conversation[] {
    return this.e_conversation;
  }

  findOne(p_id: string): Conversation | undefined {
    return this.e_conversation.find((conversation) => conversation.id === p_id);
  }

  findByParticipantId(p_participantId: string): Conversation[] {
    return this.e_conversation.filter((conversation) =>
      conversation.participants.some(
        (participant) => participant.id === p_participantId,
      ),
    );
  }

  findByParticipants(p_participantsIds: string[]): Conversation | undefined {
    return this.e_conversation.find((conversation) =>
      conversation.participants.every((participant) =>
        p_participantsIds.includes(participant.id),
      ),
    );
  }
}
