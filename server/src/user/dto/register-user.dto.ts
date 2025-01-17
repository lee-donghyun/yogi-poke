import { IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsOptional()
  referrerId?: number;
}
