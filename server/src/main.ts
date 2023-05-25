import fastify from 'fastify';
import { router } from './route/router';

const app = fastify({ logger: true });

app.register(router);

app.listen({ port: 3000 });
