import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/', async (req) => {
  return 'hello yogfdfi-poke';
});

app.listen({ port: 3000 });
