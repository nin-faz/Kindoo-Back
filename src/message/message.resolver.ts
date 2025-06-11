import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly s_messageService: MessageService) {}

  @Mutation(() => Message)
  async sendMessage(
    @Args('createMessageInput') p_createMessageInput: CreateMessageInput
  ): Promise<Message> {
    return await this.s_messageService.create(p_createMessageInput);
  }

  @Query(() => [Message])
  async getAllMessages(): Promise<Message[]> {
    return this.s_messageService.findAll();
  }

  @Query(() => [Message])
  async getMessagesByAuthor(
    @Args('authorId') p_authorId: string,
  ): Promise<Message[]> {
    return this.s_messageService.findByAuthorId(p_authorId);
  }

  @Query(() => Message, { nullable: true })
  async getMessageById(@Args('id') p_id: string): Promise<Message | null> {
    return this.s_messageService.findById(p_id);
  }

  @Query(() => [Message])
  async getByConversationId(
    @Args('conversationId') p_conversationId: string,
  ): Promise<Message[]> {
    return this.s_messageService.findByConversationId(p_conversationId);
  }
}
