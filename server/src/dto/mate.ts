import { dto } from '../utils/dto';

export const requestRelationDto = dto<{
  email: string;
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
