import { User } from '../../generated/prisma/client';

export type UserWithoutPw = Omit<User, 'password'>