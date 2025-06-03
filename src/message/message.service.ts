import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageInput } from './dto/create-message.input';

@Injectable()
export class MessageService {
  private e_messages: Message[] = [];

  create(p_createMessageDto : CreateMessageInput): Message {
    const newMessage: Message = {
      id: uuidv4(),
      content: p_createMessageDto.content,
      createdAt: new Date(),
      authorId: p_createMessageDto.authorId,
      conversationId: p_createMessageDto.conversationId
    };
    this.e_messages.push(newMessage);
    return newMessage;
  }

  findAll(): Message[] {
    return this.e_messages;
  }

  findByAuthorId(p_authorId: string): Message[] {
    return this.e_messages.filter(msg => msg.authorId === p_authorId);
  }

  findById(p_id: string): Message | undefined {
    return this.e_messages.find(msg => msg.id === p_id);
  }

  findByConversationId(p_conversationId: string): Message[] {
    return this.e_messages.filter(msg => msg.conversationId === p_conversationId);
  }
}
