import { dto } from '../utils/dto';

export const registerUserDto = dto<{
  body: {
    email: string;
    password: string;
    name: string;
  };
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
      name: {
        type: 'string',
      },
    },
    required: ['email', 'password', 'name'],
    additionalProperties: false,
  },
});

export const authTokenHeaderDto = dto<{
  headers: {
    authorization: string;
  };
}>({
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
      },
    },
    required: ['authorization'],
  },
});
