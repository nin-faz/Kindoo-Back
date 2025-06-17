import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => [String], { description: 'Liste des IDs des participants' })
  participantIds: string[];
}