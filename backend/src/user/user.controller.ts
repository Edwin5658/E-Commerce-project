import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserWithoutPw } from 'src/common/types';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService

  ) { }

  @Get('/users')
  async getAllUsers(): Promise<UserWithoutPw[]> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUserById(
    @Param('id') userId: number
  ): Promise<UserWithoutPw> {
    return this.userService.getUserById(userId);
  }
  
  @Get()
  async getUserByEmail(
    @Query('email') email: string
  ): Promise<UserWithoutPw> {
    return this.userService.getUserByEmail(email);
  }

  @Put()
  async updateUserPassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ): Promise<UserWithoutPw> {
    return this.userService.updateUserPassword(updateUserPasswordDto);
  }

  @Put()
  async updateUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ): Promise<UserWithoutPw> {
    return this.userService.updateUserProfile(updateUserProfileDto);
  }
}
