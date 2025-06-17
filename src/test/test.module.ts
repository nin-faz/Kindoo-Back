import { Module } from '@nestjs/common';
import { TestResolver } from './test.resolver';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [TestResolver, PrismaService],
})
export class TestModule {}
