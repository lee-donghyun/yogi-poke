import fastify from 'fastify';
import { router } from './route/router';
import { authPlugin } from './plugin/auth';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import { Error2 } from './utils/error';
import fastifyMultipart from '@fastify/multipart';

const app = fastify({ logger: true });

app.register(fastifySwagger);
app.register(fastifySwaggerUi);
app.register(cors);
app.register(fastifyMultipart);
app.register(router);
app.register(authPlugin);

app.setErrorHandler(async (error: Error2, _, reply) => {
  const { statusCode = 500, ...rest } = error;
  reply.status(statusCode);
  console.error(error);
  return rest;
});

app.listen({ port: Number(process.env.PORT ?? 8080), host: '0.0.0.0' });
