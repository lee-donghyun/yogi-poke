import { dto } from '../utils/dto';

export const requestRelationDto = dto<{
  body: {
    email: string;
  };
}>({
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
    },
    required: ['email'],
    additionalProperties: false,
  },
});
