import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageInput } from './dto/create-message.input';

describe('MessageService', () => {
  let service: MessageService;
  let mockPrismaService: any;
  let mockQueueService: any;

  beforeEach(async () => {
    mockPrismaService = {
      message: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    mockQueueService = {
      addJob: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'BullQueue_messages', useValue: mockQueueService },
      ],
    }).compile();
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new message and call addJob on queue', async () => {
      const createMessageDto: CreateMessageInput = {
        content: 'Salut',
        authorId: 'author-1',
        conversationId: 'conv-1',
      };
      const savedMessage = {
        id: 'msg-1',
        ...createMessageDto,
        createdAt: new Date(),
      };
      mockPrismaService.message.create.mockResolvedValue(savedMessage);
      mockQueueService.addJob.mockResolvedValue(undefined);
      const result = await service.create(createMessageDto);
      expect(mockPrismaService.message.create).toHaveBeenCalledWith({
        data: expect.objectContaining(createMessageDto),
      });
      expect(mockQueueService.addJob).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedMessage);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      const messages = [
        {
          id: '1',
          content: 'Hello',
          authorId: 'a1',
          conversationId: 'c1',
          createdAt: new Date(),
        },
        {
          id: '2',
          content: 'World',
          authorId: 'a2',
          conversationId: 'c2',
          createdAt: new Date(),
        },
      ];
      mockPrismaService.message.findMany.mockResolvedValue(messages);
      const result = await service.findAll();
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(messages);
    });
  });

  describe('findByAuthorId', () => {
    it('should return messages filtered by authorId', async () => {
      const authorId = 'author1';
      const messages = [
        {
          id: '1',
          content: 'Msg',
          authorId,
          conversationId: 'c1',
          createdAt: new Date(),
        },
      ];
      mockPrismaService.message.findMany.mockResolvedValue(messages);
      const result = await service.findByAuthorId(authorId);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        where: { authorId },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(messages);
    });
  });

  describe('findById', () => {
    it('should return the message with the given id', async () => {
      const message = {
        id: 'msg-1',
        content: 'Unique',
        authorId: 'a',
        conversationId: 'c',
        createdAt: new Date(),
      };
      mockPrismaService.message.findUnique.mockResolvedValue(message);
      const result = await service.findById('msg-1');
      expect(mockPrismaService.message.findUnique).toHaveBeenCalledWith({
        where: { id: 'msg-1' },
      });
      expect(result).toEqual(message);
    });
    it('should return null if not found', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);
      const result = await service.findById('not-exist');
      expect(result).toBeNull();
    });
  });

  describe('findByConversationId', () => {
    it('should return all messages for a given conversationId', async () => {
      const conversationId = 'conv-123';
      const messages = [
        {
          id: '1',
          content: 'Msg 1',
          authorId: 'a1',
          conversationId,
          createdAt: new Date(),
        },
        {
          id: '2',
          content: 'Msg 2',
          authorId: 'a2',
          conversationId,
          createdAt: new Date(),
        },
      ];
      mockPrismaService.message.findMany.mockResolvedValue(messages);
      const result = await service.findByConversationId(conversationId);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(messages);
    });
    it('should return an empty array if no messages found', async () => {
      mockPrismaService.message.findMany.mockResolvedValue([]);
      const result = await service.findByConversationId('not-exist');
      expect(result).toEqual([]);
    });
  });
});
