import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  // @Field(() => ID)
  // id: string;

  // @Field()
  // createdAt: Date;

  @Field()
  userName: string;

  @Field()
  password: string;
}
