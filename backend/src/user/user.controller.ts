import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '../../generated/prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
    
  ) {}

  @Post('/register')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
