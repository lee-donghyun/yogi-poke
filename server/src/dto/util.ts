import { dto } from '../utils/dto';

export const referrerSchema = dto<{
  params: {
    referrer: string;
  };
}>({
  querystring: {
    type: 'object',
    properties: {
      referrer: { type: 'string' },
    },
  },
});
