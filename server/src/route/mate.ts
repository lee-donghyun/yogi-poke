import { getPokeListDto, requestRelationDto } from '../dto/mate';
import { assertAuth } from '../plugin/auth';
import { createRelation, getRelatedPokesList, pokeMate } from '../service/mate';
import { getUser } from '../service/user';
import { FastifyPluginAsync } from 'fastify';

export const mateRouter: FastifyPluginAsync = async (instance) => {
  instance.post(
    '/relation',
    { schema: requestRelationDto.schema },
    async (req) => {
      const body = req.body as typeof requestRelationDto.type.body;
      const { id: fromUserId } = assertAuth(req.user);
      const { id: toUserId } = await getUser({ email: body.email });

      const made = await createRelation(fromUserId, toUserId);
      return made;
    }
  );
  instance.post(
    '/poke',
    { schema: requestRelationDto.schema },
    async (req, rep) => {
      const body = req.body as typeof requestRelationDto.type.body;
      const { id: fromUserId } = assertAuth(req.user);
      const { id: toUserId } = await getUser({ email: body.email });

      await pokeMate(fromUserId, toUserId);
      rep.status(201);
    }
  );
  instance.get('/poke', { schema: getPokeListDto.schema }, async (req) => {
    const user = assertAuth(req.user);
    const query = req.query as typeof getPokeListDto.type.query;
    const relatedPokes = await getRelatedPokesList(user.id, {
      limit: query.limit ?? 20,
      page: query.page ?? 1,
    });
    return relatedPokes;
  });
};
