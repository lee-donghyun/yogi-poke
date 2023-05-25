import fastify from 'fastify';
import { router } from './route/router';

const app = fastify({ logger: true });

app.register(router);
app.setErrorHandler<{ code: number; name: string; message: string }>(
  async (error, _, reply) => {
    const { code = 500, ...rest } = error;
    reply.code(code);
    return rest;
  }
);

app.listen({ port: 3000 });
