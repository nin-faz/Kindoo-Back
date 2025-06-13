import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateMessageInput } from './dto/create-message.input';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueService } from '../bullMQ/queue.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue('messages') private readonly s_queueService: QueueService,
    p_prismaService: PrismaService,
  ) 
  {
    this.s_prismaService = p_prismaService;
  }

  private readonly s_prismaService: PrismaService;

  private readonly e_messages: Message[] = [];

  async create(p_createMessageDto: CreateMessageInput): Promise<Message> {
    const v_newMessage: Message = {
      id: uuidv4(),
      content: p_createMessageDto.content,
      createdAt: new Date(),
      authorId: p_createMessageDto.authorId,
      conversationId: p_createMessageDto.conversationId,
    };

    await this.s_queueService.addJob(
      `Conversation ${v_newMessage.conversationId}`,
      {
        messageId: v_newMessage.id,
        content: v_newMessage.content,
        authorId: v_newMessage.authorId,
        conversationId: v_newMessage.conversationId,
        createdAt: v_newMessage.createdAt.toISOString(),
      },
    );

    return v_newMessage;
  }

  findAll(): Promise<Message[]> {
    return this.s_prismaService.message.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  findByAuthorId(p_authorId: string): Promise<Message[]> {
    return this.s_prismaService.message.findMany({
      where: { authorId: p_authorId },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(p_id: string): Promise<Message | null> {
    return this.s_prismaService.message.findUnique({
      where: { id: p_id }, 
    });
  }

  findByConversationId(p_conversationId: string): Promise<Message[]> {
    return this.s_prismaService.message.findMany({
      where: { conversationId: p_conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
