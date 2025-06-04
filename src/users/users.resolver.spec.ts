import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  // Mock UsersService
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
    it('should call s_usersService.findAll and return an array of users', () => {
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
      mockUsersService.findAll.mockReturnValue(expectedUsers);

      const result = resolver.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should call s_usersService.findOne and return a user', () => {
      const userId = '0';
      const expectedUser: User = {
        id: '0',
        userName: 'user0',
        password: 'user0',
        createdAt: new Date(),
      };
      mockUsersService.findOne.mockReturnValue(expectedUser);

      const result = resolver.findOne(userId);

      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('updateUser', () => {
    it('should call s_usersService.update and return the updated user', () => {
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
      mockUsersService.update.mockReturnValue(updatedUser);

      const result = resolver.updateUser(updateInput, userId);

      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateInput);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('removeUser', () => {
    it('should call s_usersService.remove and return the removed user', () => {
      const userId = '0';
      const removedUser: User = {
        id: '0',
        userName: 'removeUser',
        password: 'removeUser',
        createdAt: new Date(),
      };
      mockUsersService.remove.mockReturnValue(removedUser);

      const result = resolver.removeUser(userId);

      expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual(removedUser);
    });
  });
});
