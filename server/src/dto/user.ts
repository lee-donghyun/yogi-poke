export const registerUserDto = {
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      password: {
        type: 'number',
      },
    },
    required: ['id', 'password'],
    additionalProperties: false,
  },
};
