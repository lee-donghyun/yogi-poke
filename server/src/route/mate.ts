import { requestRelationDto } from '../dto/mate';
import { assertAuth } from '../plugin/auth';
import { createRelation, getRelation } from '../service/mate';
import { getUser } from '../service/user';
import { FastifyPluginAsync } from 'fastify';
import { createError } from '../utils/error';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';

export const mateRouter: FastifyPluginAsync = async (instance) => {
  instance.post(
    '/relation',
    { schema: requestRelationDto.schema },
    async (req) => {
      const body = req.body as typeof requestRelationDto.type;
      const { id: fromUserId } = assertAuth(req.user);
      const { id: toUserId } = await getUser({ email: body.email });
      if (await getRelation(fromUserId, toUserId)) {
        throw createError({
          statusCode: 409,
          message: CLIENT_ERROR_MESSAGE.ALREADY_HAS_RELATION,
        });
      }
      const made = await createRelation(fromUserId, toUserId);
      return made;
    }
  );
};
