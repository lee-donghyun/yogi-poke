import { FastifyPluginAsync } from 'fastify';
import { uploadAndGetStorageUrl } from '../service/util';
import { createError } from '../utils/error';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { assertAuth } from '../plugin/auth';

export const UtilRouter: FastifyPluginAsync = async (instance) => {
  instance.post('/image', {}, async (req) => {
    const { email: userName } = assertAuth(req.user);
    const file = await req.file({ limits: { fileSize: 4_000_000 } });
    if (file === undefined) {
      throw createError({
        statusCode: 400,
        message: CLIENT_ERROR_MESSAGE.BAD_REQUEST,
      });
    }
    const [category, type] = file.mimetype.split('/');
    if (category !== 'image') {
      throw createError({
        statusCode: 400,
        message: CLIENT_ERROR_MESSAGE.BAD_REQUEST,
      });
    }
    return uploadAndGetStorageUrl(await file.toBuffer(), {
      type,
      userName,
    });
  });
};
