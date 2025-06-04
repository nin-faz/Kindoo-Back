import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('username') username: string,
    @Args('pass') pass: string,
  ): Promise<string> {
    const result = await this.authService.signIn(username, pass);
    return result.access_token;
  }
}
