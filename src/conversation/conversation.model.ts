import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/message/message.model';
import { User } from 'src/user/user.model';

@ObjectType({ description: 'Conversation model' })
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => [Message], { nullable: 'itemsAndList' })
  messages?: Message[];

  @Field(() => [User], { nullable: false })
  users: User[];

  @Field()
  createdAt: Date;
}
