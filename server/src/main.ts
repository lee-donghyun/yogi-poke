import fastify from 'fastify';
import { router } from './route/router';
import { authPlugin } from './plugin/auth';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import { Error2 } from './utils/error';
import fastifyMultipart from '@fastify/multipart';
import fs from 'fs';
import { getPath } from './service/util';

const app = fastify({
  logger: true,
  https: {
    key: fs.readFileSync(getPath('../../certification/private.key')),
    cert: fs.readFileSync(getPath('../../certification/certificate.crt')),
    ca: fs.readFileSync(getPath('../../certification/ca_bundle.crt')),
  },
});

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
