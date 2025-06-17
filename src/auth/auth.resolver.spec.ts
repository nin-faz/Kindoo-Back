import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = { signIn: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();
    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should return the access token on successful login', async () => {
      mockAuthService.signIn.mockResolvedValue({ access_token: 'jwt-token' });
      const result = await resolver.login('user1', 'pass');
      expect(mockAuthService.signIn).toHaveBeenCalledWith('user1', 'pass');
      expect(result).toBe('jwt-token');
    });

    it('should throw if AuthService.signIn throws', async () => {
      mockAuthService.signIn.mockRejectedValue(
        new Error('Invalid credentials'),
      );
      await expect(resolver.login('user1', 'wrongpass')).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
