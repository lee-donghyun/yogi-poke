import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsInt, IsOptional } from 'class-validator';

export class GetUserListParamDto {
  @IsOptional()
  email?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  ids?: number[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFollowing?: boolean;

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
