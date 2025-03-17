import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // register a user
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.signUp(signUpDto.email, signUpDto.senha);
  }

  // login a user
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.senha);
  }

  // return user data from token
  @HttpCode(HttpStatus.OK)
  @Post('me')
  getUsuario(@Body() data: Record<string, any>) {
    return this.authService.getUsuario(data.access_token);
  }

  // logout a user and invalidate the token
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() data: Record<string, any>) {
    return this.authService.logout(data.access_token);
  }
}
