import { FastifyPluginAsync } from 'fastify';
import { authTokenHeaderDto, registerUserDto } from '../dto/user';
import { getUser, registerUser } from '../service/user';
import { createUserToken, verifyUserToken } from '../service/auth';

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
    (req) => {
      const headers = req.headers as typeof authTokenHeaderDto.type.headers;
      const id = verifyUserToken(headers.authorization);
      return getUser({ id: id.userId });
    }
  );
};
