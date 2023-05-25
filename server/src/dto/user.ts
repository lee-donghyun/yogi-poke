import { dto } from '../utils/dto';

export const registerUserDto = dto<{
  id: string;
  password: string;
}>({
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    required: ['id', 'password'],
    additionalProperties: false,
  },
});
