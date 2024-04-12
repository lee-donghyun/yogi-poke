import { userRouter } from './user';
import { mateRouter } from './mate';
import { FastifyPluginAsync } from 'fastify';
import { utilRouter } from './util';
import { checkHealth } from '../service/util';

export const router: FastifyPluginAsync = async (instance) => {
  instance.register(userRouter, { prefix: '/user' });
  instance.register(mateRouter, { prefix: '/mate' });
  instance.register(utilRouter, { prefix: '/util' });
  instance.get('/ping', () =>
    checkHealth().then((health) => (health ? 'good' : 'bad')),
  );
};
