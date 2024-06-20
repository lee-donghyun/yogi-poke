import { IsEmail } from 'class-validator';

export { GetPokeListDto as GetUserRelatedPokeListDto } from './get-poke-list.dto';
export class GetUserRelatedPokeListParamDto {
  @IsEmail()
  email: string;
}
