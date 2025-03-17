import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // register a user
  async signUp(email: string, pass: string): Promise<void> {
    await this.usersService.create(email, pass);
    return await this.usersService.findOne(email);
  }

  // login a user
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; email: string }> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h', // Define o tempo de expiração para 1 hora
    });

    return {
      access_token,
      email: user.email,
    };
  }

  // return user data from token
  async getUser(
    token: string,
  ): Promise<{ id: string; email: string }> {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOne(payload.email);
    return {
      id: user.id,
      email: user.email
    };
  }

  // logout a user and invalidate the token
  async logout(token: string): Promise<void> {
    // Invalidate the token
    // This is where you would add the token to a blacklist
    // The token is now invalid
  }
}
