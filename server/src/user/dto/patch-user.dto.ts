import { IsJSON, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsJSON()
  pushSubscription?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}
