import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { CreateMessageInput } from './dto/create-message.input';

describe('MessageService', () => {
  let service: MessageService;

  // Mock du QueueService avec addJob mocké
  const mockQueueService = {
    addJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: 'BullQueue_messages', // clé générée par @InjectQueue('messages')
          useValue: mockQueueService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new message and call addJob on queue', async () => {
    const createMessageDto: CreateMessageInput = {
      content: 'Salut',
      authorId: 'author-1',
      conversationId: 'conv-1',
    };

    const result = await service.create(createMessageDto);

    // Vérifie que le message a bien été créé
    expect(result).toHaveProperty('id');
    expect(result.content).toBe(createMessageDto.content);

    // Vérifie que addJob a été appelé une fois avec les bons paramètres
    expect(mockQueueService.addJob).toHaveBeenCalledTimes(1);
    expect(mockQueueService.addJob).toHaveBeenCalledWith(
      `Conversation ${createMessageDto.conversationId}`,
      expect.objectContaining({
        messageId: expect.any(String),
        content: createMessageDto.content,
        authorId: createMessageDto.authorId,
        conversationId: createMessageDto.conversationId,
        createdAt: expect.any(String),
      }),
    );
  });

  it('should return all messages with findAll', async () => {
    // On ajoute un message via create (pour avoir du contenu)
    const createMessageDto = {
      content: 'Message test',
      authorId: 'author-2',
      conversationId: 'conv-2',
    };

    await service.create(createMessageDto);

    const allMessages = service.findAll();

    expect(allMessages.length).toBeGreaterThan(0);
    expect(allMessages[0]).toHaveProperty('content', 'Message test');
  });

  it('should return messages filtered by authorId with findByAuthorId', async () => {
    // Création de deux messages avec auteurs différents
    await service.create({
      content: 'Message de author1',
      authorId: 'author1',
      conversationId: 'conv1',
    });

    await service.create({
      content: 'Message de author2',
      authorId: 'author2',
      conversationId: 'conv2',
    });

    const messagesByAuthor1 = service.findByAuthorId('author1');
    expect(messagesByAuthor1.length).toBe(1);
    expect(messagesByAuthor1[0].authorId).toBe('author1');
    expect(messagesByAuthor1[0].content).toBe('Message de author1');
  });

  it('should return the message with the given id using findById', async () => {
    const createdMessage = await service.create({
      content: 'Message unique',
      authorId: 'authorX',
      conversationId: 'convX',
    });

    const foundMessage = service.findById(createdMessage.id);

    expect(foundMessage).toBeDefined();
    expect(foundMessage?.id).toBe(createdMessage.id);
    expect(foundMessage?.content).toBe('Message unique');
  });

  it('should return all messages for a given conversationId', async () => {
    await service.create({
      content: 'Msg 1',
      authorId: 'authorA',
      conversationId: 'conv123',
    });
    await service.create({
      content: 'Msg 2',
      authorId: 'authorB',
      conversationId: 'conv123',
    });
    await service.create({
      content: 'Msg 3',
      authorId: 'authorC',
      conversationId: 'conv999',
    });

    const messages = service.findByConversationId('conv123');

    expect(messages.length).toBe(2);
    expect(messages.every((m) => m.conversationId === 'conv123')).toBe(true);
  });
});
