import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStrongPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    return (
      typeof password === 'string' &&
      password.length > 5 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0–9]/.test(password) 
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be longer than 6 characters and include at least one uppercase letter, one lowercase letter and one number';
  }
}