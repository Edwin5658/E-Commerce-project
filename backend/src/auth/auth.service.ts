import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserWithoutPw } from 'src/common/types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserWithoutPw> {
        const { password, ...user } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                ...user,
                password: hashedPassword
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
        const tokens = await this.getTokens(newUser.id, newUser.email);

        return savedUser;

    }

    async validateUser(email: string, password: string): Promise<UserWithoutPw | null> {
        const user = await this.userService.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: UserWithoutPw) {

    }

    async getTokens(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                // TODO: env config
                { secret: 'at-secret', expiresIn: '30m' },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                // TODO: env config
                { secret: 'rt-secret', expiresIn: '7d' },
            ),
        ]);
        return { access_token: at, refresh_token: rt };
    }

}
