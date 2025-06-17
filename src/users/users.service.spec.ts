import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockPrismaService: any;

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserInput: CreateUserInput = {
        userName: 'user1',
        password: 'pass',
      };
      const createdUser = {
        id: '1',
        userName: 'user1',
        password: 'hashed',
        createdAt: new Date(),
      };
      mockPrismaService.user.create.mockResolvedValue(createdUser);
      const result = await service.create(createUserInput);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userName: 'user1',
          password: expect.any(String),
        }),
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', userName: 'user1', password: 'p', createdAt: new Date() },
        { id: '2', userName: 'user2', password: 'p', createdAt: new Date() },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);
      const result = await service.findAll();
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const user = {
        id: '1',
        userName: 'user1',
        password: 'p',
        createdAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const result = await service.findOne('user1');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userName: 'user1' },
      });
      expect(result).toEqual(user);
    });
    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await service.findOne('not-exist');
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const user = {
        id: '1',
        userName: 'user1',
        password: 'p',
        createdAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const result = await service.findOneById('1');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(user);
    });
    it('should return null if user not found by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await service.findOneById('not-exist');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userId = '1';
      const updateInput: UpdateUserInput = {
        userName: 'new',
        password: 'newpass',
      };
      const existingUser = {
        id: userId,
        userName: 'old',
        password: 'old',
        createdAt: new Date(),
      };
      const updatedUser = {
        id: userId,
        userName: 'new',
        password: 'newpass',
        createdAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      const result = await service.update(userId, updateInput);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { userName: 'new', password: 'newpass' },
      });
      expect(result).toEqual(updatedUser);
    });
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        service.update('not-exist', { userName: 'x', password: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user and return a string', async () => {
      const user = {
        id: '1',
        userName: 'user1',
        password: 'p',
        createdAt: new Date(),
      };
      mockPrismaService.user.delete.mockResolvedValue(user);
      const result = await service.remove('1');
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(`User removed: ${user.userName}`);
    });
  });
});
