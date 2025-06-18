import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

const mockPrismaService = {
  conversation: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockUsersService = {
  findOneById: jest.fn(),
};

const mockEventEmitter = { emit: jest.fn() };

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new conversation with valid users', async () => {
      const createConversationDto: CreateConversationInput = {
        participantIds: ['user-1', 'user-2'],
      };
      const users = [
        {
          id: 'user-1',
          userName: 'User One',
          password: '',
          createdAt: new Date(),
        },
        {
          id: 'user-2',
          userName: 'User Two',
          password: '',
          createdAt: new Date(),
        },
      ];
      mockUsersService.findOneById.mockImplementation((id) =>
        users.find((u) => u.id === id),
      );
      const expectedConversation = {
        id: 'conv-1',
        createdAt: new Date(),
        participants: users,
      };
      mockPrismaService.conversation.create.mockResolvedValue(
        expectedConversation,
      );

      const result = await service.create(createConversationDto);
      expect(mockUsersService.findOneById).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.conversation.create).toHaveBeenCalledWith({
        data: {
          participants: {
            connect: [{ id: 'user-1' }, { id: 'user-2' }],
          },
        },
        include: { participants: true },
      });
      expect(result).toEqual(expectedConversation);
    });
  });

  describe('findAll', () => {
    it('should return all conversations', async () => {
      const expectedConversations = [
        { id: 'conv-1', createdAt: new Date(), participants: [] },
        { id: 'conv-2', createdAt: new Date(), participants: [] },
      ];
      mockPrismaService.conversation.findMany.mockResolvedValue(
        expectedConversations,
      );
      const result = await service.findAll();
      expect(mockPrismaService.conversation.findMany).toHaveBeenCalledWith({
        include: { participants: true },
      });
      expect(result).toEqual(expectedConversations);
    });
  });

  describe('findOne', () => {
    it('should return the conversation with the given id', async () => {
      const expectedConversation = {
        id: 'conv-1',
        createdAt: new Date(),
        participants: [],
      };
      mockPrismaService.conversation.findUnique.mockResolvedValue(
        expectedConversation,
      );
      const result = await service.findOne('conv-1');
      expect(mockPrismaService.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: 'conv-1' },
        include: { participants: true },
      });
      expect(result).toEqual(expectedConversation);
    });
  });

  describe('findByParticipantId', () => {
    it('should return all conversations for a given participantId', async () => {
      const expectedConversations = [
        {
          id: 'conv-1',
          createdAt: new Date(),
          participants: [{ id: 'user-1' }],
        },
      ];
      mockPrismaService.conversation.findMany.mockResolvedValue(
        expectedConversations,
      );
      const result = await service.findByParticipantId('user-1');
      expect(mockPrismaService.conversation.findMany).toHaveBeenCalledWith({
        where: { participants: { some: { id: 'user-1' } } },
        include: { participants: true },
      });
      expect(result).toEqual(expectedConversations);
    });
  });

  describe('findByParticipants', () => {
    it('should return the conversation matching all participant ids', async () => {
      const conversations = [
        {
          id: 'conv-1',
          createdAt: new Date(),
          participants: [{ id: 'user-1' }, { id: 'user-2' }],
        },
        {
          id: 'conv-2',
          createdAt: new Date(),
          participants: [{ id: 'user-3' }, { id: 'user-4' }],
        },
      ];
      mockPrismaService.conversation.findMany.mockResolvedValue(conversations);
      const result = await service.findByParticipants(['user-1', 'user-2']);
      expect(result).toEqual(conversations[0]);
    });
    it('should return null if no conversation matches', async () => {
      mockPrismaService.conversation.findMany.mockResolvedValue([]);
      const result = await service.findByParticipants(['user-x', 'user-y']);
      expect(result).toBeNull();
    });
  });
});
