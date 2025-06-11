// import { Test, TestingModule } from '@nestjs/testing';
// import { ConversationService } from './conversation.service';
// import { CreateConversationInput } from './dto/create-conversation.input';

// describe('ConversationService', () => {
//   let service: ConversationService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [ConversationService],
//     }).compile();

//     service = module.get<ConversationService>(ConversationService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should create a new conversation', () => {
//     const createConversationDto: CreateConversationInput = {
//       participantIds: ['user-1', 'user-2'],
//     };

//     const result = service.create(createConversationDto);

//     expect(result).toHaveProperty('id');
//     expect(result).toHaveProperty('createdAt');
//     expect(result.participants.length).toBe(2);
//     expect(result.participants.map((p) => p.id)).toEqual(
//       expect.arrayContaining(createConversationDto.participantIds),
//     );
//   });

//   it('should return all conversations with findAll', () => {
//     const createConversationDto: CreateConversationInput = {
//       participantIds: ['user-a', 'user-b'],
//     };
//     service.create(createConversationDto);

//     const allConversations = service.findAll();

//     expect(allConversations.length).toBeGreaterThan(0);
//     expect(allConversations[0].participants.map((p) => p.id)).toEqual(
//       expect.arrayContaining(createConversationDto.participantIds),
//     );
//   });

//   it('should return the conversation with the given id using findOne', () => {
//     const createConversationDto: CreateConversationInput = {
//       participantIds: ['user-x', 'user-y'],
//     };
//     const createdConversation = service.create(createConversationDto);

//     const foundConversation = service.findOne(createdConversation.id);

//     expect(foundConversation).toBeDefined();
//     expect(foundConversation?.id).toBe(createdConversation.id);
//   });

//   it('should return all conversations for a given participantId with findByParticipantId', () => {
//     service.create({ participantIds: ['participant-1', 'participant-2'] });
//     service.create({ participantIds: ['participant-1', 'participant-3'] });
//     service.create({ participantIds: ['participant-2', 'participant-4'] });

//     const conversationsForParticipant1 =
//       service.findByParticipantId('participant-1');
//     expect(conversationsForParticipant1.length).toBe(2);
//     conversationsForParticipant1.forEach((conv) => {
//       expect(conv.participants.some((p) => p.id === 'participant-1')).toBe(
//         true,
//       );
//     });

//     const conversationsForParticipant4 =
//       service.findByParticipantId('participant-4');
//     expect(conversationsForParticipant4.length).toBe(1);
//     expect(
//       conversationsForParticipant4[0].participants.some(
//         (p) => p.id === 'participant-4',
//       ),
//     ).toBe(true);

//     const conversationsForNonExistentParticipant =
//       service.findByParticipantId('non-existent-user');
//     expect(conversationsForNonExistentParticipant.length).toBe(0);
//   });
// });
