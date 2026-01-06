import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserWithoutPw } from 'src/common/types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from './types/tokens.type';
import { AuthDto } from './dto/auth.dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Tokens> {
    const { password, ...user } = createUserDto;
    const hashedPassword = await argon.hash(password);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPw | null> {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await argon.verify(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon.verify(user.password, authDto.password);
    if (!passwordMatches) throw new ForbiddenException('Wrong Password');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async getTokens(userId: number, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };
    // signing tokens
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        // TODO: env config
        { secret: 'at-secret', expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        payload,
        // TODO: env config
        { secret: 'rt-secret', expiresIn: '7d' },
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRt = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRt,
      },
    });
  }
}
