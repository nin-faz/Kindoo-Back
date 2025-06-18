import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private s_usersService: UsersService,
    private s_jwtService: JwtService
  ) {}

  /**
   * Authentifie un utilisateur et génère un token JWT.
   * @param p_username Le nom d'utilisateur
   * @param p_pass Le mot de passe
   * @returns Un objet contenant le token d'accès
   */
  async signIn(p_username: string, p_pass: string): Promise<any> {
    // Vérifie que l'utilisateur existe et que le mot de passe correspond
    const v_user = await this.s_usersService.findOne(p_username);
    if (!v_user || !(await bcrypt.compare(p_pass, v_user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password, ...result } = v_user;
    const v_payload = { username: result.userName, sub: result.id };
    return {
      access_token: this.s_jwtService.sign(v_payload, {
        expiresIn: '10m',
      }),
    };
  }
}

