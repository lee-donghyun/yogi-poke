import fastify from 'fastify';
import { router } from './route/router';
import { authPlugin } from './plugin/auth';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const app = fastify({ logger: true });

app.register(fastifySwagger);
app.register(fastifySwaggerUi);
app.register(router);
app.register(authPlugin);

app.setErrorHandler(async (error, _, reply) => {
  const { statusCode = 500, ...rest } = error;
  reply.code(statusCode);
  return rest;
});

app.listen({ port: 3000 });
