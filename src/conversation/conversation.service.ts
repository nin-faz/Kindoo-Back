
import { Injectable } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
    private e_conversation: Conversation[] = [];
  
  create(p_createConversationInput: CreateConversationInput) {
    const v_participants = p_createConversationInput.participantIds.map(id => ({ id } as any));
    const v_newConversation: Conversation = {
      id: uuidv4(),
      createdAt: new Date(),
      participants: v_participants
    };
    this.e_conversation.push(v_newConversation);
    return v_newConversation;
  }

  findAll() : Conversation[] {
    return this.e_conversation;
 }

  findOne(p_id: string) : Conversation | undefined {
    return this.e_conversation.find(conversation => conversation.id === p_id);
  }

  findConversationByParticipantId(p_participantId: string): Conversation[] {
    return this.e_conversation.filter(conversation =>
      conversation.participants.some(participant => participant.id === p_participantId)
    );
  }
}
