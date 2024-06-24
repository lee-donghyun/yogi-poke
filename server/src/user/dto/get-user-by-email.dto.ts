import { IsEmail } from 'class-validator';

export class GetUserByEmailParamDto {
  @IsEmail()
  email: string;
}
