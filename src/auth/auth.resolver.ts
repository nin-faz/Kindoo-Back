import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Connexion d'utilisateur.
   * @param username - Le nom d'utilisateur de l'utilisateur.
   * @param pass - Le mot de passe de l'utilisateur.
   * @returns Une chaîne contenant le token d'accès.
   */
  @Mutation(() => String)
  async login(
    @Args('p_username') p_username: string,
    @Args('p_pass') p_pass: string,
  ): Promise<string> {
    const result = await this.authService.signIn(p_username, p_pass);
    return result.access_token;
  }
}

