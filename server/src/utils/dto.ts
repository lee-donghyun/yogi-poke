import { FastifySchema } from 'fastify';

export const dto = <T>(schema: FastifySchema) => ({
  schema,
  type: null as T,
});
