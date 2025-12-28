import { IsEmail, IsEnum, IsNotEmpty, Validate } from 'class-validator';
import { Role } from 'generated/prisma/enums';
import { IsValidPasswordConstraint } from '../validator/is-valid-password.validator';

export class CreateUserDto {
    @IsEmail(undefined, {
        message: 'Invalid Email'
    })
    email: string;

    @Validate(IsValidPasswordConstraint)
    password: string;

    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @IsNotEmpty({message: 'Please provide your role'})
    @IsEnum(Role, {
        message: 'Role must be either USER or ADMIN'
    })
    role: Role;
}