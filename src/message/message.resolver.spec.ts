import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

describe('MessageResolver', () => {
  let resolver: MessageResolver;

  // Mock basique du MessageService avec findAll mockée
  const mockMessageService = {
    findAll: jest.fn().mockReturnValue([
      {
        id: '1',
        content: 'Hello',
        authorId: 'a1',
        conversationId: 'c1',
        createdAt: new Date(),
      },
    ]),
    create: jest.fn(),
    findByAuthorId: jest.fn(),
    findById: jest.fn(),
    findByConversationId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call create and return the created message from sendMessage', async () => {
    const createInput = {
      content: 'Salut',
      authorId: 'author-1',
      conversationId: 'conv-1',
    };

    const createdMessage = {
      id: 'msg-123',
      ...createInput,
      createdAt: new Date(),
    };

    mockMessageService.create = jest.fn().mockResolvedValue(createdMessage);

    const result = await resolver.sendMessage(createInput);

    expect(mockMessageService.create).toHaveBeenCalledTimes(1);
    expect(mockMessageService.create).toHaveBeenCalledWith(createInput);
    expect(result).toEqual(createdMessage);
  });

  it('should return all messages from getAllMessages', () => {
    const result = resolver.getAllMessages();
    expect(result).toEqual([
      {
        id: '1',
        content: 'Hello',
        authorId: 'a1',
        conversationId: 'c1',
        createdAt: expect.any(Date),
      },
    ]);
    expect(mockMessageService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return messages by author from getMessagesByAuthor', () => {
    const authorId = 'a1';
    const messagesByAuthor = [
      {
        id: '2',
        content: 'Message by author a1',
        authorId,
        conversationId: 'c2',
        createdAt: new Date(),
      },
    ];

    mockMessageService.findByAuthorId.mockReturnValue(messagesByAuthor);

    const result = resolver.getMessagesByAuthor(authorId);

    expect(mockMessageService.findByAuthorId).toHaveBeenCalledTimes(1);
    expect(mockMessageService.findByAuthorId).toHaveBeenCalledWith(authorId);
    expect(result).toEqual(messagesByAuthor);
  });

  it('should return a message by id from getMessageById', () => {
    const messageId = 'msg-123';
    const message = {
      id: messageId,
      content: 'Message unique',
      authorId: 'authorX',
      conversationId: 'convX',
      createdAt: new Date(),
    };

    mockMessageService.findById.mockReturnValue(message);

    const result = resolver.getMessageById(messageId);

    expect(mockMessageService.findById).toHaveBeenCalledTimes(1);
    expect(mockMessageService.findById).toHaveBeenCalledWith(messageId);
    expect(result).toEqual(message);
  });

  it('should return messages by conversationId from getByConversationId', () => {
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

    mockMessageService.findByConversationId = jest
      .fn()
      .mockReturnValue(messages);

    const result = resolver.getByConversationId(conversationId);

    expect(mockMessageService.findByConversationId).toHaveBeenCalledTimes(1);
    expect(mockMessageService.findByConversationId).toHaveBeenCalledWith(
      conversationId,
    );
    expect(result).toEqual(messages);
  });
});
