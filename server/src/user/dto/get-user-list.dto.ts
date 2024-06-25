import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class GetUserListParamDto {
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsOptional()
  email: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ids: number[];
}
