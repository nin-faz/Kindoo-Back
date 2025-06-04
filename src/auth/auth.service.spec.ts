import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockUsersService = { findOne: jest.fn() };
    const mockJwtService = { sign: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'UsersService', useValue: mockUsersService },
        { provide: 'JwtService', useValue: mockJwtService },
      ],
    })
      .overrideProvider('UsersService')
      .useValue(mockUsersService)
      .overrideProvider('JwtService')
      .useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

