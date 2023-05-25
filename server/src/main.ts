import fastify from 'fastify';
import { router } from './routes/router';

const app = fastify({ logger: true });

app.register(router);

app.listen({ port: 3000 });
