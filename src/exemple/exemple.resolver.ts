import { Field, ObjectType, Query, Resolver } from "@nestjs/graphql";

@ObjectType()
class TestResult {
  @Field()
  result: string;
}

@Resolver(() => TestResult)
export class TestResolver {
  @Query(() => TestResult)
  getTest(): TestResult {
    return { result: 'ok' };
  }
}