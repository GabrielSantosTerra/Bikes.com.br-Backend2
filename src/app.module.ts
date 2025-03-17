import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { UsuariosService } from './usuarios/usuarios.service';
import { PessoasService } from './pessoas/pessoas.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, UsuariosModule, PessoasModule],
  controllers: [AppController],
  providers: [AppService, UsuariosService, PessoasService],
})
export class AppModule {}
