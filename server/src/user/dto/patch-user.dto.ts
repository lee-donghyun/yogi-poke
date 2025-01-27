import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  pushOnFollow?: boolean;

  @IsBoolean()
  @IsOptional()
  pushOnPoke?: boolean;

  @IsObject()
  @IsOptional()
  pushSubscription?: PushSubscriptionJSON;
}
