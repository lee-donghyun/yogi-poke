import { FastifyPluginAsync } from 'fastify';
import { registerUserDto } from '../dto/user';
import { registerUser } from '../service/user';

export const userRouter: FastifyPluginAsync = async (instance) => {
  instance.post(
    '/register',
    { schema: registerUserDto.schema },
    async (req) => {
      const body = req.body as typeof registerUserDto.type;
      registerUser(body);
      return { body };
    }
  );
};
