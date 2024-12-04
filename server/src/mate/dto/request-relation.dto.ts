import {
  IsString,
  ValidateNested,
  IsNotEmptyObject,
  IsIn,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class NormalPokePayload {
  @IsIn(['normal'])
  type: 'normal';
}

class EmojiPokePayload {
  @IsIn(['emoji'])
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

class DrawingPokePayload {
  @IsIn(['drawing'])
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
class GeolocationPokePayload {
  @IsIn(['geolocation'])
  type: 'geolocation';
  @Type(() => Position)
  position: Position;
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
