import { IsEmail } from 'class-validator';

export class RequestRelationDto {
  @IsEmail()
  email: string;
}
