import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should call s_usersService.create and return the created user', async () => {
      const createInput: CreateUserInput = {
        userName: 'user1',
        password: 'user1',
      };
      const expectedUser: User = {
        id: '0',
        userName: 'user2',
        password: 'user2',
        createdAt: new Date(),
      };
      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await resolver.createUser(createInput);

      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(createInput);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should call s_usersService.findAll and return an array of users', async () => {
      const expectedUsers: User[] = [
        {
          id: '1',
          userName: 'user1',
          password: 'user1',
          createdAt: new Date(),
        },
        {
          id: '2',
          userName: 'user2',
          password: 'user2',
          createdAt: new Date(),
        },
      ];
      mockUsersService.findAll.mockResolvedValue(expectedUsers);
      const result = await resolver.findAll();
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should call s_usersService.findOne and return a user', async () => {
      const userId = '0';
      const expectedUser: User = {
        id: '0',
        userName: 'user0',
        password: 'user0',
        createdAt: new Date(),
      };
      mockUsersService.findOne.mockResolvedValue(expectedUser);
      const result = await resolver.findOne(userId);
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });
    it('should return null if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      const result = await resolver.findOne('not-exist');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should call s_usersService.update and return the updated user', async () => {
      const userId = '0';
      const updateInput: UpdateUserInput = {
        userName: 'userUpdated',
        password: 'newuser',
      };
      const updatedUser: User = {
        id: '0',
        userName: 'userUpdated',
        password: 'newuser',
        createdAt: new Date(),
      };
      mockUsersService.update.mockResolvedValue(updatedUser);
      const result = await resolver.updateUser(updateInput, userId);
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateInput);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('removeUser', () => {
    it('should call s_usersService.remove and return the removed user id as string', async () => {
      const userId = '0';
      mockUsersService.remove.mockResolvedValue(userId);
      const result = await resolver.removeUser(userId);
      expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userId);
    });
  });
});
