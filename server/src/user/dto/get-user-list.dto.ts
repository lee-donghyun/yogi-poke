import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional } from 'class-validator';

export class GetUserListParamDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderBy: 'asc' | 'desc';

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsOptional()
  email?: string;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsOptional()
  ids?: number[];
}
