import { Storage } from '@google-cloud/storage';
import Jimp from 'jimp';
import path from 'path';
import { db } from '../repository/prisma';

export const getPath = (relativePath: string) =>
  path.resolve(__dirname, relativePath);
const storage = new Storage({
  keyFilename: getPath('../../certification/gcp_key.json'),
});
const bucketId = process.env.ASSET_BUCKET_ID || 'ASSET_BUCKET_ID';

export const uploadAndGetStorageUrl = async (
  buffer: Buffer,
  { type, title }: { type: string; title: string },
) => {
  const fileName = `${title}.${type}`;
  const assets = storage.bucket(bucketId);
  await assets.file(fileName).save(buffer);
  return `https://storage.googleapis.com/${bucketId}/${fileName}`;
};

export const getWebManifest = (tag: string | null) => {
  return {
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: `/?is-pwa=1${tag ? `&tag=${tag}` : ''}`,
    name: '\uc694\uae30\ucf55\ucf55!',
    short_name: '\uc694\uae30\ucf55\ucf55!',
    description:
      '\ud83d\udc4b \uc9c0\uae08 \uc774 \uc21c\uac04, \uc0c8\ub85c\uc6b4 \uc18c\uc15c \ubbf8\ub514\uc5b4 \ud601\uc2e0\uc774 \uc2dc\uc791\ub429\ub2c8\ub2e4.',
    icons: [
      {
        src: '/domain-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/domain-icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/domain-icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/domain-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
};

export const getDocument = async (tag: string | null) => {
  const user = tag
    ? await db.user.findUnique({
        where: { email: tag },
      })
    : null;
  if (user) {
    const logoImageJimp = await Jimp.read(getPath('../../public/logo.png'));
    const profileImageJimp = await Jimp.read(
      user.profileImageUrl ?? getPath('../../public/default_user_profile.png'),
    );
    profileImageJimp.resize(200, 200);
    const ogImageJimp = logoImageJimp.composite(
      profileImageJimp.circle(),
      logoImageJimp.getWidth() - 280,
      logoImageJimp.getHeight() / 2 - 100,
    );
    const ogImageUrl = await uploadAndGetStorageUrl(
      await ogImageJimp.getBufferAsync('image/png'),
      { type: 'png', title: `og-image/${user.id}` },
    );
    return `<!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>!</title>
        <meta property="og:title" content="${user.name}님을 콕 찔러보세요.">
        <meta property="og:site_name" content="요기콕콕!">
        <meta property="og:url" content="https://www.yogi-poke.social?tag=${tag}">
        <meta property="og:description" content="링크를 눌러서 요기콕콕!앱을 설치하세요.">
        <meta name="description" content="링크를 눌러서 요기콕콕!앱을 설치하세요." />
        <meta property="og:type" content="profile">
        <meta property="og:image" content="${ogImageUrl}">
      </head>
      <body>
      </body>
    </html>`;
  }
  return `<!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="utf-8" />
      <title>요기콕콕!</title>
      <meta property="og:title" content="요기콕콕!">
      <meta property="og:site_name" content="요기콕콕!">
      <meta property="og:url" content="https://www.yogi-poke.social">
      <meta property="og:description" content="링크를 눌러서 요기콕콕!앱을 설치하세요.">
      <meta property="og:type" content="profile">
      <meta property="og:image" content="/asset/logo.png">
      <meta name="description" content="링크를 눌러서 요기콕콕!앱을 설치하세요." />
    </head>
    <body>
    </body>
  </html>`;
};

export const checkHealth = async () => {
  try {
    await db.$queryRaw`SELECT 1;`;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
