import { FastifyPluginAsync } from 'fastify';
import { registerUserDto } from '../dto/user';

export const userRouter: FastifyPluginAsync = async (instance) => {
  instance.post('/register', { schema: registerUserDto }, async (req) => {
    return { token: 'Bearer asdfasdf', ...(req.body ?? {}) };
  });
};
