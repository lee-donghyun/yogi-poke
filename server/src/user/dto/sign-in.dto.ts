import { IsEmail, IsString } from 'class-validator';

export class signInUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
