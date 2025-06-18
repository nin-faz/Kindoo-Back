import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly s_conversationService: ConversationService) {}

  /**
   * Crée une nouvelle conversation avec les participants.
   * @param p_createConversationInput - Input contenant les IDs des participants.
   * @returns La conversation créée.
   */
  @Mutation(() => Conversation)
  createConversation(@Args('p_createConversationInput') p_createConversationInput: CreateConversationInput) {
    return this.s_conversationService.create(p_createConversationInput);
  }

  /**
   * Récupère toutes les conversations.
   * @returns La liste de toutes les conversations.
   */
  @Query(() => [Conversation])
  findAll() {
    return this.s_conversationService.findAll();
  }

  /**
   * Récupère une conversation par son ID.
   * @param p_id - L'ID de la conversation à récupérer.
   * @returns La conversation correspondante.
   */
  @Query(() => Conversation)
  findOne(@Args('p_id', { type: () => String }) p_id: string) {
    return this.s_conversationService.findOne(p_id);
  }

  /**
   * Récupère les conversations d'un participant par son ID.
   * @param p_participantId - L'ID du participant.
   * @returns La liste des conversations auxquelles le participant participe.
   */
  @Query(() => [Conversation])
  findByParticipantId(@Args('p_participantId', { type: () => String }) p_participantId: string) {
    return this.s_conversationService.findByParticipantId(p_participantId);
  }

  /**
   * Récupère une conversation par les IDs de ses participants.
   * @param p_participantsIds - Liste des IDs des participants.
   * @returns La conversation correspondante ou null si elle n'existe pas.
   */
  @Query(() => Conversation, { nullable: true })
  findByParticipants(@Args('p_participantsIds', { type: () => [String] }) p_participantsIds: string[]) {
    return this.s_conversationService.findByParticipants(p_participantsIds);
  }
}
