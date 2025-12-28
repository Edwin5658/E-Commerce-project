import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsValidPasswordConstraint } from '../validator/is-valid-password.validator';

export class UpdateUserPasswordDto {

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    oldPassword: string;

    @Validate(IsValidPasswordConstraint)
    newPassword: string;

}