import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PessoasService {
  constructor(private prisma: PrismaService) {}

  // find a user
  async findOne(email: string): Promise<any> {
    return this.prisma.pessoa.findFirst({
      where: { email },
    });
  }

  // create a user
  async create(
    nome: string,
    cpf_cnpj: string,
    telefone: string,
    email: string,
    data_nascimento: string,
    tipo_pessoa: string,
  ): Promise<void> {
    // Verifica se o email já existe
    const emailExists = await this.prisma.pessoa.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException('Email já está em uso');
    }

    // Adiciona o novo usuário
    await this.prisma.pessoa.create({
      data: {
        nome,
        cpf_cnpj,
        telefone,
        email,
        data_nascimento,
        tipo_pessoa,
      },
    });
  }
}
