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
  ) {
    this.s_prismaService = p_prismaService;
  }

  private readonly s_prismaService: PrismaService;

  /**
   * Crée un nouveau message et l'ajoute à la queue BullMQ.
   * @param p_createMessageDto - Input contenant les détails du message.
   * @returns Le message créé.
   */
  async create(p_createMessageDto: CreateMessageInput): Promise<Message> {
    // Générer un nouvel ID pour le message
    const v_newMessageData = {
      id: uuidv4(),
      content: p_createMessageDto.content,
      createdAt: new Date(),
      authorId: p_createMessageDto.authorId,
      conversationId: p_createMessageDto.conversationId,
    };
    // Sauvegarder le message en base
    const v_newMessage = await this.s_prismaService.message.create({
      data: v_newMessageData,
    });
    // Ajouter le job à la queue
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
    console.log('✅ Job ajouté dans la queue BullMQ');
    return v_newMessage;
  }

  /**
   * Récupère tous les messages, triés par date de création.
   * @returns La liste de tous les messages.
   */
  findAll(): Promise<Message[]> {
    return this.s_prismaService.message.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Récupère les messages d'un auteur spécifique, triés par date de création.
   * @param p_authorId - L'ID de l'auteur des messages à récupérer.
   * @returns La liste des messages de l'auteur spécifié.
   */
  findByAuthorId(p_authorId: string): Promise<Message[]> {
    return this.s_prismaService.message.findMany({
      where: { authorId: p_authorId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Récupère un message par son ID.
   * @param p_id - L'ID du message à récupérer.
   * @returns Le message correspondant ou null si il n'existe pas.
   */
  findById(p_id: string): Promise<Message | null> {
    return this.s_prismaService.message.findUnique({
      where: { id: p_id },
    });
  }

  /**
   * Récupère les messages d'une conversation spécifique, triés par date de création.
   * @param p_conversationId - L'ID de la conversation dont on veut récupérer les messages.
   * @returns La liste des messages de la conversation spécifiée.
   */
  findByConversationId(p_conversationId: string): Promise<Message[]> {
    return this.s_prismaService.message.findMany({
      where: { conversationId: p_conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
