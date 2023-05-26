import { fastifyPlugin } from 'fastify-plugin';
import { requestRelationDto } from '../dto/mate';
import { assertAuth } from '../plugin/auth';
import { createRelation } from '../service/mate';
import { getUser } from '../service/user';
import { FastifyPluginAsync } from 'fastify';

export const mateRouter: FastifyPluginAsync = async (instance) => {
  instance.post(
    '/relation',
    { schema: requestRelationDto.schema },
    async (req) => {
      const body = req.body as typeof requestRelationDto.type;
      const { id: fromUserId } = assertAuth(req.user);
      const { id: toUserId } = await getUser({ email: body.email });
      const made = await createRelation(fromUserId, toUserId);
      return made;
    }
  );
};
