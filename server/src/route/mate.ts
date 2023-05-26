import { requestRelationDto } from '../dto/mate';
import { assertAuth } from '../plugin/auth';
import { createRelation, pokeMate } from '../service/mate';
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
};
