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

export const getPokeListDto = dto<{
  query: {
    limit?: number;
    page?: number;
  };
}>({
  querystring: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
      },
      page: {
        type: 'number',
      },
    },
    additionalProperties: false,
  },
});

export const getUserRelatedPokeListDto = dto<{
  query: {
    limit?: number;
    page?: number;
  };
  params: {
    email: string;
  };
}>({
  querystring: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
      },
      page: {
        type: 'number',
      },
    },
    additionalProperties: false,
  },
  params: {
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
