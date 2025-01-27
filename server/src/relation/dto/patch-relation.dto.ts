import { IsBoolean, IsOptional } from 'class-validator';

export class PatchRelationDto {
  @IsBoolean()
  @IsOptional()
  isAccepted?: boolean;

  @IsBoolean()
  @IsOptional()
  isFollowing?: boolean;
}
