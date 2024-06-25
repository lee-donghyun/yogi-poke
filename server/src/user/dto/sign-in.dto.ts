import { IsString } from 'class-validator';

export class signInUserDto {
  email: string;

  @IsString()
  password: string;
}
