import { dto } from '../utils/dto';

export const referrerSchema = dto<{
  params: {
    referrer: string;
  };
}>({
  params: {
    type: 'object',
    properties: {
      referrer: { type: 'string' },
    },
  },
});
