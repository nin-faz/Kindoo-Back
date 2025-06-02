import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Message model' })
export class Message {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  content?: string;

  @Field()
  createdAt: Date;

  @Field(() => ID)
  authorId: string;
}
