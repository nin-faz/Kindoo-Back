import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageInput } from './dto/create-message.input';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueService } from 'src/bullMQ/queue.service';
import { Queue } from 'bullmq';

@Injectable()
export class MessageService {

    constructor(
      @InjectQueue('messages') private readonly s_queueService: QueueService,
    ) {}
    
  private e_messages: Message[] = [
    {
      id: uuidv4(),
      content: 'Hello, this is a mock message 1',
      createdAt: new Date(Date.now() - 100000),
      authorId: 'user1',
      conversationId: '1'
    },
    {
      id: uuidv4(),
      content: 'Hi, this is a mock message 2',
      createdAt: new Date(Date.now() - 90000),
      authorId: 'user2',
      conversationId: '1'
    },
    {
      id: uuidv4(),
      content: 'Bonjour, message fictif 3',
      createdAt: new Date(Date.now() - 80000),
      authorId: 'user1',
      conversationId: '2'
    }
  ];

  async create(p_createMessageDto : CreateMessageInput): Promise<Message> {
    const v_newMessage: Message = {
      id: uuidv4(),
      content: p_createMessageDto.content,
      createdAt: new Date(),
      authorId: p_createMessageDto.authorId,
      conversationId: p_createMessageDto.conversationId
    };
    this.e_messages.push(v_newMessage);

    await this.s_queueService.addJob(`Conversation ${v_newMessage.conversationId}`, {
      messageId: v_newMessage.id,
      content: v_newMessage.content,
      authorId: v_newMessage.authorId,
      conversationId: v_newMessage.conversationId,
      createdAt: v_newMessage.createdAt.toISOString()
    });
    return v_newMessage;
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
