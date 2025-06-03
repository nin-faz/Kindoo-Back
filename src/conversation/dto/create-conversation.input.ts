import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => [ID], { description: 'Liste des IDs des participants' })
  participantIds: string[];
}