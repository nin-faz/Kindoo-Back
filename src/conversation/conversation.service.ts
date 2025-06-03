import { Injectable } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
    private e_conversation: Conversation[] = [
    {
      id: '1',
      participants: [
        { id: 'user1', username: 'Alice', password: 'alicepass', createdAt: new Date('2024-05-01T10:00:00Z') },
        { id: 'user2', username: 'Bob', password: 'bobpass', createdAt: new Date('2024-05-02T10:00:00Z') }
      ],
      createdAt: new Date('2024-06-01T10:00:00Z')
    },
    {
      id: '2',
      participants: [
        { id: 'user2', username: 'Bob', password: 'bobpass', createdAt: new Date('2024-05-02T10:00:00Z') },
        { id: 'user3', username: 'Charlie', password: 'charliepass', createdAt: new Date('2024-05-03T10:00:00Z') }
      ],
      createdAt: new Date('2024-06-02T11:00:00Z')
    },
    {
      id: '3',
      participants: [
        { id: 'user1', username: 'Alice', password: 'alicepass', createdAt: new Date('2024-05-01T10:00:00Z') },
        { id: 'user3', username: 'Charlie', password: 'charliepass', createdAt: new Date('2024-05-03T10:00:00Z') }
      ],
      createdAt: new Date('2024-06-02T11:00:00Z')
    }
  ];

  // Ajoute une méthode utilitaire pour retrouver un utilisateur par son id dans les conversations mock
  private findUserById(userId: string) {
    for (const conv of this.e_conversation) {
      const user = conv.participants.find(p => p.id === userId);
      if (user) return user;
    }
    return null;
  }
  
  create(p_createConversationInput: CreateConversationInput) {
    // Pour chaque participant, récupère toutes les infos si elles existent déjà
    const v_participants = p_createConversationInput.participantIds.map(id => {
      const existing = this.findUserById(id);
      if (existing) {
        return { ...existing };
      }
      // fallback minimal si l'utilisateur n'existe pas dans les mocks
      return {
        id,
        username: 'Unknown',
        password: '',
        createdAt: new Date()
      };
    });
    
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

  findByParticipantId(p_participantId: string): Conversation[] {
    return this.e_conversation.filter(conversation =>
      conversation.participants.some(participant => participant.id === p_participantId)
    );
  }
}
