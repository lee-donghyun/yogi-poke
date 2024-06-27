import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetPokeListDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number;
}
