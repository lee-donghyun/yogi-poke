import {
  getPokeListDto,
  getUserRelatedPokeListDto,
  requestRelationDto,
} from '../dto/mate';
import { assertAuth } from '../plugin/auth';
import {
  createRelation,
  getRelatedPokesList,
  getRelatedPokesListBetweenUsers,
  pokeMate,
} from '../service/mate';
import { sendPushNotification } from '../service/push';
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
      const { id: fromUserId, email, name } = assertAuth(req.user);
      const { id: toUserId, pushSubscription } = await getUser(body);

      await pokeMate(fromUserId, toUserId);
      if (pushSubscription !== null) {
        sendPushNotification(toUserId, {
          title: '요기콕콕!',
          body: `${email}님이 회원님을 콕 찔렀어요!`,
        }).catch();
      }
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
  instance.get(
    '/poke/:email',
    { schema: getUserRelatedPokeListDto.schema },
    async (req) => {
      const query = req.query as typeof getUserRelatedPokeListDto.type.query;
      const params = req.params as typeof getUserRelatedPokeListDto.type.params;

      const { id: userId1 } = assertAuth(req.user);
      const { id: userId2 } = await getUser({ email: params.email });

      return getRelatedPokesListBetweenUsers(
        { userId1, userId2 },
        { limit: query.limit ?? 20, page: query.page ?? 1 }
      );
    }
  );
};
