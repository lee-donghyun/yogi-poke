import { IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  referrerId?: number;
}
