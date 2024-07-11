import { IsString, ValidateNested, IsNotEmptyObject } from 'class-validator';
import { Type } from 'class-transformer';

class NormalPokePayload {
  type: 'normal';
}

class EmojiPokePayload {
  type: 'emoji';

  @IsString()
  message: string;
}

export class RequestRelationDto {
  @IsString()
  email: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => NormalPokePayload, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: NormalPokePayload, name: 'normal' },
        { value: EmojiPokePayload, name: 'emoji' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  payload: NormalPokePayload | EmojiPokePayload;
}
