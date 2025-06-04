import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    // Vérifie que l'utilisateur existe et que le mot de passe correspond
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    // Génère le token JWT sans le mot de passe
    const { password, ...result } = user;
    const payload = { username: result.userName, sub: result.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

