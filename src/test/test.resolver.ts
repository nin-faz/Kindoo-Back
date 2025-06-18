import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Inject } from '@nestjs/common';

@Resolver()
export class TestResolver {
    constructor(
        @Inject(PrismaService)
        private readonly prisma: PrismaService,
    ) {}

    /**
     * Mutation pur supprimer les donnees creees durant les tests d'integrations.
     * @param userA_id - ID du premier utilisateur testé
     * @param userB_id - ID du second utilisateur testé
     * @param conversation_id - ID de la conversation de test à supprimer
     * @returns Un boolean indiquant si la suppression a réussi
     */
    @Mutation(() => Boolean)
    async deleteTestData(
    @Args('p_userA_id') p_userA_id: string,
        @Args('p_userB_id') p_userB_id: string,
        @Args('p_conversation_id') p_conversation_id: string,
        ): Promise<boolean> {
        try {
            await this.prisma.message.deleteMany({
            where: {
                OR: [
                { authorId: p_userA_id },
                { authorId: p_userB_id },
                { conversationId: p_conversation_id },
                ],
            },
            });

            await this.prisma.conversation.deleteMany({
            where: { id: p_conversation_id },
            });

            await this.prisma.user.deleteMany({
            where: {
                id: { in: [p_userA_id, p_userB_id] },
            },
            });

            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la suppression des données de test :', error);
            throw new Error(`Suppression échouée : ${error.message}`);
        }
    }
}
