import { Module } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PessoasService],
  exports: [PessoasService],
})
export class PessoasModule {}