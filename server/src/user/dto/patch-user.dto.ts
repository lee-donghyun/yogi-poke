import { IsObject, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsObject()
  pushSubscription?: PushSubscriptionJSON;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}
