import { getUser } from '../service/user';
import { verifyUserToken } from '../service/auth';
import fastifyPlugin from 'fastify-plugin';

export const authPlugin = fastifyPlugin(async (instance) => {
  instance.decorateRequest('user', null);
  instance.addHook('preHandler', async (request) => {
    const token = request.headers.authorization;
    if (!token) return;
    request.user = await getUser({ id: verifyUserToken(token).userId });
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      email: string;
    } | null;
  }
}
