import { verifyUserToken, JwtPayload } from '../service/auth';
import fastifyPlugin from 'fastify-plugin';
import { createError } from '../utils/error';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';

export const authPlugin = fastifyPlugin(async (instance) => {
  instance.decorateRequest('user', null);
  instance.addHook('preHandler', async (request) => {
    request.user = null;
    const token = request.headers.authorization;
    if (!token) return;
    try {
      const user = verifyUserToken(token);
      request.user = user;
    } catch {
      request.user = null;
    }
  });
});

export const assertAuth = (requestUser: RequestUser) => {
  if (requestUser === null) {
    throw createError({
      statusCode: 401,
      message: CLIENT_ERROR_MESSAGE.UNAUTORIZED,
    });
  }
  return requestUser;
};

type RequestUser = JwtPayload | null;

declare module 'fastify' {
  interface FastifyRequest {
    user: RequestUser;
  }
}
