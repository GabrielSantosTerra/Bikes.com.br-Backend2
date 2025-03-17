import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // find a user
  async findOne(email: string): Promise<any> {
    return this.prisma.usuario.findFirst({
      where: { email },
    });
  }

  // create a user
  async create(email: string, senha: string): Promise<void> {
    // Verifica se o email já existe
    const emailExists = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException('Email já está em uso');
    }

    const saltRounds = 10;
    const hashedSenha = await bcrypt.hash(senha, saltRounds);

    // Adiciona o novo usuário
    await this.prisma.usuario.create({
      data: {
        email,
        senha: hashedSenha,
      },
    });
  }
}
