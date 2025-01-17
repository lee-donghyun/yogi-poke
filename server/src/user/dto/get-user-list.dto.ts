import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional } from 'class-validator';

export class GetUserListParamDto {
  @IsOptional()
  email?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  ids?: number[];

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  name?: string;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  orderBy: 'asc' | 'desc';

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;
}
