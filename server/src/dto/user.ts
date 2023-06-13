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

export const signInUserDto = dto<{
  body: {
    email: string;
    password: string;
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
    },
    required: ['email', 'password'],
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

export const patchUserDto = dto<{
  body: {
    password?: string;
    name?: string;
    pushSubscription?: PushSubscriptionJSON | null;
    profileImageUrl?: string;
  };
}>({
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      pushSubscription: {
        type: ['object', 'null'],
      },
      profileImageUrl: {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
});

export const getUserListDto = dto<{
  query: {
    limit?: number;
    page?: number;
    email?: string;
    ids?: number[];
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
      email: {
        type: 'string',
      },
      ids: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    },
    additionalProperties: false,
  },
});

export const getUserDto = dto<{
  params: {
    email: string;
  };
}>({
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
