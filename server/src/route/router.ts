import { userRouter } from './user';
import { mateRouter } from './mate';
import { FastifyPluginAsync } from 'fastify';
import { UtilRouter } from './util';

export const router: FastifyPluginAsync = async (instance) => {
  instance.register(userRouter, { prefix: '/user' });
  instance.register(mateRouter, { prefix: '/mate' });
  instance.register(UtilRouter, { prefix: '/util' });
};
