import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUsersService = { findOne: jest.fn() };
    mockJwtService = { sign: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access_token if credentials are valid', async () => {
      const user = {
        id: '1',
        userName: 'user1',
        password: await bcrypt.hash('pass', 10),
      };
      mockUsersService.findOne.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('jwt-token');
      const result = await service.signIn('user1', 'pass');
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user1');
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          username: 'user1',
          sub: '1',
        },
        { expiresIn: '10m' },
      );
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      await expect(service.signIn('user1', 'pass')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = {
        id: '1',
        userName: 'user1',
        password: await bcrypt.hash('otherpass', 10),
      };
      mockUsersService.findOne.mockResolvedValue(user);
      await expect(service.signIn('user1', 'pass')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
