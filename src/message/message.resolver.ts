import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly s_messageService: MessageService) {}

  /**
   * Envoie un message.
   * @param p_createMessageInput - Input contenant les détails du message à envoyer.
   * @returns Le message envoyé.
   */
  @Mutation(() => Message)
  async sendMessage(
    @Args('p_createMessageInput') p_createMessageInput: CreateMessageInput
  ): Promise<Message> {
    return await this.s_messageService.create(p_createMessageInput);
  }

  /**
   * Récupère tous les messages.
   * @returns La liste de tous les messages.
   */
  @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
    return this.s_messageService.findAll();
  }

  /**
   * Récupère les messages d'un auteur spécifique.
   * @param p_authorId - L'ID de l'auteur des messages à récupérer.
   * @returns La liste des messages de l'auteur spécifié.
   */
  @Query(() => [Message])
  async getMessagesByAuthor(
    @Args('p_authorId') p_authorId: string,
  ): Promise<Message[]> {
    return this.s_messageService.findByAuthorId(p_authorId);
  }

  /**
   * Récupère un message par son ID.
   * @param p_id - L'ID du message à récupérer.
   * @returns Le message correspondant ou null si il n'existe pas.
   */
  @Query(() => Message, { nullable: true })
  async getMessageById(@Args('p_id') p_id: string): Promise<Message | null> {
    return this.s_messageService.findById(p_id);
  }

  /**
   * Récupère les messages d'une conversation spécifique.
   * @param p_conversationId - L'ID de la conversation dont on veut récupérer les messages.
   * @returns La liste des messages de la conversation spécifiée.
   */
  @Query(() => [Message])
  async getByConversationId(
    @Args('p_conversationId') p_conversationId: string,
  ): Promise<Message[]> {
    return this.s_messageService.findByConversationId(p_conversationId);
  }
}
