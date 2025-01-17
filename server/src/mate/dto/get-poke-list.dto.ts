import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetPokeListDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number;
}
