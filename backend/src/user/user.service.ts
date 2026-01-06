import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '../../generated/prisma/client';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserWithoutPw } from 'src/common/types';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers(): Promise<UserWithoutPw[]> {
    return await this.prisma.user.findMany();
  }

  async getUserById(inputId: number): Promise<UserWithoutPw> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: inputId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${inputId} not found`);
    }

    return user;
  }

  async getUserByEmail(address: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: address
      }
    });

    if (!user) {
      throw new NotFoundException(`User with email ${address} not found`);
    }

    return user;
  }

  async updateUserPassword(updatePasswordDto: UpdateUserPasswordDto): Promise<UserWithoutPw> {
    const { userId, oldPassword, newPassword } = updatePasswordDto;
    const updateUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: newPassword
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return updateUser;
  }

  async updateUserProfile(updateUserProfileDto: UpdateUserProfileDto): Promise<UserWithoutPw> {
    const { userId, firstName, lastName } = updateUserProfileDto;
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        firstName: firstName,
        lastName: lastName
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;

  }


}