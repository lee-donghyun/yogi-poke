import {
  IsString,
  ValidateNested,
  IsNotEmptyObject,
  IsIn,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  Equals,
} from 'class-validator';
import { Type } from 'class-transformer';

class PokePayload {
  type: string;
}
class NormalPokePayload extends PokePayload {
  @Equals('normal')
  type: 'normal';
}

class EmojiPokePayload extends PokePayload {
  @Equals('emoji')
  type: 'emoji';

  @IsString()
  message: string;
}
class Line {
  @IsNumber()
  id: number;

  @IsString()
  color: string;

  @IsArray()
  @IsNumber({}, { each: true })
  points: number[];
}

class DrawingPokePayload extends PokePayload {
  @Equals('drawing')
  type: 'drawing';

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Line)
  lines: Line[][];
}
class Position {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
class GeolocationPokePayload extends PokePayload {
  @Equals('geolocation')
  type: 'geolocation';
  @Type(() => Position)
  position: Position;
}

export class RequestRelationDto {
  @IsString()
  email: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PokePayload, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: NormalPokePayload, name: 'normal' },
        { value: EmojiPokePayload, name: 'emoji' },
        { value: DrawingPokePayload, name: 'drawing' },
        { value: GeolocationPokePayload, name: 'geolocation' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  payload:
    | NormalPokePayload
    | EmojiPokePayload
    | DrawingPokePayload
    | GeolocationPokePayload;
}
