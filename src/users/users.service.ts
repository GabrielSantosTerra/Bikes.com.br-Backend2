import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // find a user
  async findOne(email: string): Promise<any> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  // create a user
  async create(email: string, password: string): Promise<void> {
    // Verifica se o email já existe
    const emailExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException('Email já está em uso');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Adiciona o novo usuário
    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}
