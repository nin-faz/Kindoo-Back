import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field()
  conversationId: string;
}
