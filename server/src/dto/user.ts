import { dto } from '../utils/dto';

export const registerUserDto = dto<{
  email: string;
  password: string;
}>({
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  },
});
