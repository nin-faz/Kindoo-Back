import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType({ description: 'Message model' })
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => ID)
  authorId: User['id'];

  @Field(() => ID)
  conversationId: string;
}
