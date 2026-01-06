import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Tokens } from './types/tokens.type';
import { CurrentUser, CurrentUserId, Public } from 'src/common/decorators';
import { AuthDto } from './dto/auth.dto';
import { RtGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
    return this.authService.createUser(createUserDto);
  }

  @Public()
  @Post('/login')
  async login(@Body() authdto: AuthDto) {
    return this.authService.login(authdto);
  }

  @Post('/logout')
  async logout(@CurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  async refreshToken(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
