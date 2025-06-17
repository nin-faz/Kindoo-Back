import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { Conversation } from './entities/conversation.entity';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let service: ConversationService;

  const mockConversationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByParticipantId: jest.fn(),
    findByParticipants: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        { provide: ConversationService, useValue: mockConversationService },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createConversation', () => {
    it('should call s_conversationService.create and return the created conversation', async () => {
      const createInput: CreateConversationInput = {
        participantIds: ['user-1', 'user-2'],
      };
      const expectedConversation: Conversation = {
        id: 'conv-123',
        createdAt: new Date(),
        participants: [
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
        ],
      };
      mockConversationService.create.mockReturnValue(expectedConversation);

      const result = resolver.createConversation(createInput);

      expect(mockConversationService.create).toHaveBeenCalledTimes(1);
      expect(mockConversationService.create).toHaveBeenCalledWith(createInput);
      expect(result).toEqual(expectedConversation);
    });
  });

  describe('findAll', () => {
    it('should call s_conversationService.findAll and return an array of conversations', () => {
      const expectedConversations: Conversation[] = [
        {
          id: 'conv-1',
          createdAt: new Date(),
          participants: [
            {
              id: 'user-a',
              userName: 'User A',
              password: '',
              createdAt: new Date(),
            },
          ],
        },
        {
          id: 'conv-2',
          createdAt: new Date(),
          participants: [
            {
              id: 'user-b',
              userName: 'User B',
              password: '',
              createdAt: new Date(),
            },
          ],
        },
      ];
      mockConversationService.findAll.mockReturnValue(expectedConversations);

      const result = resolver.findAll();

      expect(mockConversationService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedConversations);
    });
  });

  describe('findOne', () => {
    it('should call s_conversationService.findOne and return a conversation', () => {
      const conversationId = '123';
      const expectedConversation: Conversation = {
        id: 'conv-123',
        createdAt: new Date(),
        participants: [
          {
            id: 'user-x',
            userName: 'User X',
            password: '',
            createdAt: new Date(),
          },
        ],
      };
      mockConversationService.findOne.mockReturnValue(expectedConversation);

      const result = resolver.findOne(conversationId);

      expect(mockConversationService.findOne).toHaveBeenCalledTimes(1);
      expect(mockConversationService.findOne).toHaveBeenCalledWith(
        conversationId.toString(),
      );
      expect(result).toEqual(expectedConversation);
    });
  });

  describe('findByParticipantId', () => {
    it('should call s_conversationService.findByParticipantId and return conversations for that participant', () => {
      const participantId = 'user-p1';
      const expectedConversations: Conversation[] = [
        {
          id: 'conv-p1-a',
          createdAt: new Date(),
          participants: [
            {
              id: 'user-p1',
              userName: 'Participant One',
              password: '',
              createdAt: new Date(),
            },
            {
              id: 'user-p2',
              userName: 'Participant Two',
              password: '',
              createdAt: new Date(),
            },
          ],
        },
      ];
      mockConversationService.findByParticipantId.mockReturnValue(
        expectedConversations,
      );

      const result = resolver.findByParticipantId(participantId);

      expect(mockConversationService.findByParticipantId).toHaveBeenCalledTimes(
        1,
      );
      expect(mockConversationService.findByParticipantId).toHaveBeenCalledWith(
        participantId,
      );
      expect(result).toEqual(expectedConversations);
    });
  });

  describe('findByParticipants', () => {
    it('should call s_conversationService.findByParticipants and return the conversation', () => {
      const participantsIds = ['user-1', 'user-2'];
      const expectedConversation: Conversation = {
        id: 'conv-xyz',
        createdAt: new Date(),
        participants: [
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
        ],
      };
      mockConversationService.findByParticipants = jest
        .fn()
        .mockReturnValue(expectedConversation);

      const result = resolver.findByParticipants(participantsIds);

      expect(mockConversationService.findByParticipants).toHaveBeenCalledTimes(
        1,
      );
      expect(mockConversationService.findByParticipants).toHaveBeenCalledWith(
        participantsIds,
      );
      expect(result).toEqual(expectedConversation);
    });

    it('should return null if no conversation is found', () => {
      const participantsIds = ['user-x', 'user-y'];
      mockConversationService.findByParticipants = jest
        .fn()
        .mockReturnValue(null);

      const result = resolver.findByParticipants(participantsIds);

      expect(mockConversationService.findByParticipants).toHaveBeenCalledWith(
        participantsIds,
      );
      expect(result).toBeNull();
    });
  });
});
