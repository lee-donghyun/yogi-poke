import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  Equals,
  IsArray,
  IsIn,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class PokePayload {
  type: string;
}
class DrawingPokePayload extends PokePayload {
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => Line)
  @ValidateNested({ each: true })
  lines: Line[][];

  @Equals('drawing')
  type: 'drawing';
}

class EmojiPokePayload extends PokePayload {
  @IsString()
  message: string;

  @Equals('emoji')
  type: 'emoji';
}
class GeolocationPokePayload extends PokePayload {
  @Type(() => Position)
  position: Position;
  @Equals('geolocation')
  type: 'geolocation';
}

class Line {
  @IsString()
  color: string;

  @IsNumber()
  id: number;

  @IsArray()
  @IsNumber({}, { each: true })
  points: number[];
}
class NormalPokePayload extends PokePayload {
  @Equals('normal')
  type: 'normal';
}
class Position {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class RequestRelationDto {
  @IsString()
  email: string;

  @IsNotEmptyObject()
  @Type(() => PokePayload, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: 'normal', value: NormalPokePayload },
        { name: 'emoji', value: EmojiPokePayload },
        { name: 'drawing', value: DrawingPokePayload },
        { name: 'geolocation', value: GeolocationPokePayload },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested()
  payload:
    | DrawingPokePayload
    | EmojiPokePayload
    | GeolocationPokePayload
    | NormalPokePayload;
}
