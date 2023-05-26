import { FastifyPluginAsync } from 'fastify';
import { authTokenHeaderDto, registerUserDto } from '../dto/user';
import { registerUser } from '../service/user';
import { createUserToken } from '../service/auth';
import { assertAuth } from '../plugin/auth';

export const userRouter: FastifyPluginAsync = async (instance) => {
  instance.post(
    '/register',
    { schema: registerUserDto.schema },
    async (req, rep) => {
      const body = req.body as typeof registerUserDto.type.body;
      const { id } = await registerUser(body);
      rep.status(201);
      return createUserToken(id);
    }
  );
  instance.get(
    '/my-info',
    {
      schema: authTokenHeaderDto.schema,
    },
    async (req) => {
      const user = assertAuth(req.user);
      return user;
    }
  );
};
