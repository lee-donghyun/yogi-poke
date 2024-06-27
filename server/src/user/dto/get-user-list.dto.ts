import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class GetUserListParamDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @IsOptional()
  email: string;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsOptional()
  ids: number[];
}
