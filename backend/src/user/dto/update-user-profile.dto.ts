import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsValidPasswordConstraint } from '../validator/is-valid-password.validator';

export class UpdateUserProfileDto {

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;


}