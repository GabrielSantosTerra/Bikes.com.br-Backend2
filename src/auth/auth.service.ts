import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PessoasService } from '../pessoas/pessoas.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private pessoasService: PessoasService,
    private jwtService: JwtService,
  ) {}

  // register a user
  async signUp(
    nome: string,
    cpf_cnpj: string,
    telefone: string,
    email: string,
    senha: string,
    data_nascimento: string,
    tipo_pessoa: string,
  ): Promise<void> {
    await this.pessoasService.create(
      nome,
      cpf_cnpj,
      telefone,
      email,
      data_nascimento,
      tipo_pessoa,
    );
    const pessoa = await this.pessoasService.findOne(email);
    await this.usuariosService.create(email, senha, pessoa.id);
    await this.usuariosService.findOne(email);
    return pessoa;
  }

  // login a user
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; email: string }> {
    const usuario = await this.usuariosService.findOne(email);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Comparação da senha digitada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(pass, usuario.senha);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h', // Define o tempo de expiração para 1 hora
    });

    return {
      access_token,
      email: usuario.email,
    };
  }

  // return user data from token
  async getUsuario(token: string): Promise<{
    usuario: any;
    pessoa: any;
  }> {
    const payload = this.jwtService.verify(token);

    // Obtém os dados do usuário e da pessoa
    const usuario = await this.usuariosService.findOne(payload.email);
    const pessoa = await this.pessoasService.findOne(payload.email);

    if (!usuario || !pessoa) {
      throw new NotFoundException('Usuário ou pessoa não encontrados');
    }

    return {
      usuario,
      pessoa,
    };
  }

  // logout a user and invalidate the token
  async logout(token: string): Promise<void> {
    // Invalidate the token
    // This is where you would add the token to a blacklist
    // The token is now invalid
  }
}
