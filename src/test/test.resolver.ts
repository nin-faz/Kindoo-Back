import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Inject } from '@nestjs/common';

@Resolver()
export class TestResolver {
    constructor(
        @Inject(PrismaService)
        private readonly prisma: PrismaService,
    ) {}

    @Mutation(() => Boolean)
    async deleteTestData(
    @Args('userA_id') userA_id: string,
        @Args('userB_id') userB_id: string,
        @Args('conversation_id') conversation_id: string,
        ): Promise<boolean> {
        try {
            await this.prisma.message.deleteMany({
            where: {
                OR: [
                { authorId: userA_id },
                { authorId: userB_id },
                { conversationId: conversation_id },
                ],
            },
            });

            await this.prisma.conversation.deleteMany({
            where: { id: conversation_id },
            });

            await this.prisma.user.deleteMany({
            where: {
                id: { in: [userA_id, userB_id] },
            },
            });

            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la suppression des données de test :', error);
            throw new Error(`Suppression échouée : ${error.message}`);
        }
    }
}
