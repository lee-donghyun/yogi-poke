import { IsBoolean } from 'class-validator';

export class PatchRelationDto {
  @IsBoolean()
  isAccepted: boolean;
}
