import { IsObject, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsObject()
  @IsOptional()
  pushSubscription?: PushSubscriptionJSON;
}
