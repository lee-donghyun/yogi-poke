import { FastifyPluginAsync } from 'fastify';
import { userRouter } from './user';

export const router: FastifyPluginAsync = async (instance) => {
  instance.register(userRouter, { prefix: '/user' });
};
