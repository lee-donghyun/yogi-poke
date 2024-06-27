import { FastifyPluginAsync } from 'fastify';
import {
  getDocument,
  getWebManifest,
  uploadAndGetStorageUrl,
} from '../service/util';
import { createError } from '../utils/error';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { assertAuth } from '../plugin/auth';
import { referrerSchema } from '../dto/util';

export const utilRouter: FastifyPluginAsync = async (instance) => {
  instance.post('/image', {}, async (req) => {
    const { email: userName } = assertAuth(req.user);
    const file = await req.file({ limits: { fileSize: 4_000_000, parts: 1 } });
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
    const buffer = await file.toBuffer();
    if (buffer.byteLength > 4_000_000) {
      throw createError({
        statusCode: 400,
        message: CLIENT_ERROR_MESSAGE.BAD_REQUEST,
      });
    }
    return uploadAndGetStorageUrl(buffer, {
      type,
      title: `${userName}-${Date.now()}`,
    });
  });
  instance.get('/web-manifest', {}, async (req) => {
    const refer = req.headers.referer;
    const tag = refer ? new URL(refer).searchParams.get('tag') : null;
    return getWebManifest(tag);
  });
  instance.get('/document/:referrer', {}, async (req, rel) => {
    const params = req.params as typeof referrerSchema.type.params;
    const referrer = params.referrer;
    if (req.headers['user-agent']?.includes('scrap')) {
      return rel
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(await getDocument(referrer));
    } else {
      return rel.redirect(307, `https://www.yogi-poke.social/?tag=${referrer}`);
    }
  });
};
