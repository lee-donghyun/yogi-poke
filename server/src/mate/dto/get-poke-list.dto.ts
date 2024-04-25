import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetPokeListDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number;
}
