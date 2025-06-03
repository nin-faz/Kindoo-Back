import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType({ description: 'Conversation model' })
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => [User], { description: 'ID Participants' })
  participants: User[];

  @Field()
  createdAt: Date;
}
