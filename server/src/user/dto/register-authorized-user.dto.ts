import { IsString } from 'class-validator';

export class RegisterAuthorizedUserDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  token: string;
}
