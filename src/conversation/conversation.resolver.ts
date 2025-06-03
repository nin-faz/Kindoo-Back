import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly s_conversationService: ConversationService) {}

  @Mutation(() => Conversation)
  createConversation(@Args('createConversationInput') createConversationInput: CreateConversationInput) {
    return this.s_conversationService.create(createConversationInput);
  }

  @Query(() => [Conversation], { name: 'conversation' })
  findAll() {
    return this.s_conversationService.findAll();
  }

  @Query(() => Conversation, { name: 'conversation' })
  findOne(@Args('id', { type: () => Int }) p_id: number) {
    return this.s_conversationService.findOne(p_id.toString());
  }

  @Query(() => [Conversation], { name: 'conversationByParticipantId' })
  findConversationByParticipantId(@Args('participantId', { type: () => String }) p_participantId: string) {
    return this.s_conversationService.findConversationByParticipantId(p_participantId);
  }
}
