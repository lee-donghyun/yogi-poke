import { FastifyPluginAsync } from 'fastify';
import {
  authTokenHeaderDto,
  getUserListDto,
  patchUserDto,
  registerUserDto,
  signInUserDto,
} from '../dto/user';
import {
  getUserByEmailAndPassword,
  getUserList,
  patchUser,
  registerUser,
} from '../service/user';
import { createUserToken } from '../service/auth';
import { assertAuth } from '../plugin/auth';
import { getPokedCount } from '../service/mate';

export const userRouter: FastifyPluginAsync = async (instance) => {
  instance.post(
    '/register',
    { schema: registerUserDto.schema },
    async (req, rep) => {
      const body = req.body as typeof registerUserDto.type.body;
      const user = await registerUser(body);
      rep.status(201);
      return createUserToken(user);
    }
  );
  instance.get(
    '/my-info',
    {
      schema: authTokenHeaderDto.schema,
    },
    async (req) => {
      const user = assertAuth(req.user);
      const pokes = await getPokedCount({ fromUserId: user.id });
      const pokeds = await getPokedCount({ toUserId: user.id });
      return { ...user, pokes, pokeds };
    }
  );
  instance.post('/sign-in', { schema: signInUserDto.schema }, async (req) => {
    const user = await getUserByEmailAndPassword(
      req.body as typeof signInUserDto.type.body
    );
    return createUserToken(user);
  });
  instance.patch(
    '/my-info',
    { schema: patchUserDto.schema },
    async (req, rep) => {
      const user = assertAuth(req.user);
      const body = req.body as typeof patchUserDto.type.body;
      const { password, ...updated } = await patchUser({
        id: user.id,
        ...body,
      });
      return updated;
    }
  );
  instance.get('/', { schema: getUserListDto.schema }, async (req) => {
    const user = assertAuth(req.user);
    const query = req.query as typeof getUserListDto.type.query;
    return getUserList(
      { email: query.email },
      { limit: query.limit ?? 20, page: query.page ?? 1 },
      user.id
    );
  });
};
