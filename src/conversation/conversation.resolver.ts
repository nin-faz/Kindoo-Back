import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly s_conversationService: ConversationService) {}

  @Mutation(() => Conversation)
  createConversation(@Args('p_createConversationInput') p_createConversationInput: CreateConversationInput) {
    return this.s_conversationService.create(p_createConversationInput);
  }

  @Query(() => [Conversation])
  findAll() {
    return this.s_conversationService.findAll();
  }

  @Query(() => Conversation)
  findOne(@Args('id', { type: () => String }) p_id: string) {
    return this.s_conversationService.findOne(p_id);
  }

  @Query(() => [Conversation])
  findByParticipantId(@Args('p_participantId', { type: () => String }) p_participantId: string) {
    return this.s_conversationService.findByParticipantId(p_participantId);
  }

  @Query(() => Conversation, { nullable: true })
  findByParticipants(@Args('p_participantsIds', { type: () => [String] }) p_participantsIds: string[]) {
    return this.s_conversationService.findByParticipants(p_participantsIds);
  }
}
