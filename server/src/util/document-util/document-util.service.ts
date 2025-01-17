import { Injectable } from '@nestjs/common';
import { Jimp } from 'jimp';
import { resolve } from 'path';
import { cwd } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';

import { FileUtilService } from '../file-util/file-util.service';

@Injectable()
export class DocumentUtilService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileUtilService: FileUtilService,
  ) {}
  async getDocument(tag: null | string) {
    const user = tag
      ? await this.prismaService.activeUser.findUnique({
          where: { email: tag },
        })
      : null;
    if (!user) {
      return this.getRawDocument({
        image: '/asset/logo.png',
        title: '요기콕콕!',
        url: 'https://yogi-poke.vercel.app',
      });
    }

    const ogImageTemplateJimp = await Jimp.read(
      resolve(cwd(), 'public/logo.png'),
    );
    const profileImageJimp = await Jimp.read(
      user.profileImageUrl ?? resolve(cwd(), 'public/default_user_profile.png'),
    );
    profileImageJimp.resize({ h: 200, w: 200 });
    ogImageTemplateJimp.composite(
      profileImageJimp.circle(),
      ogImageTemplateJimp.width - 280,
      ogImageTemplateJimp.height / 2 - 100,
    );
    const buffer = await ogImageTemplateJimp.getBuffer('image/png');
    const ogImageUrl = await this.fileUtilService.uploadAndGetUrl(
      buffer,
      `og-image-${user.id}.png`,
    );
    return this.getRawDocument({
      image: ogImageUrl,
      title: `${user.name}님을 콕 찔러보세요.`,
      url: `https://yogi-poke.vercel.app/me/${user.email}`,
    });
  }

  getWebManifest(tag: null | string) {
    return {
      background_color: '#ffffff',
      description:
        '\ud83d\udc4b \uc9c0\uae08 \uc774 \uc21c\uac04, \uc0c8\ub85c\uc6b4 \uc18c\uc15c \ubbf8\ub514\uc5b4 \ud601\uc2e0\uc774 \uc2dc\uc791\ub429\ub2c8\ub2e4.',
      display: 'standalone',
      icons: [
        {
          sizes: '192x192',
          src: '/icon-192x192.png',
          type: 'image/png',
        },
        {
          sizes: '256x256',
          src: '/icon-256x256.png',
          type: 'image/png',
        },
        {
          sizes: '384x384',
          src: '/icon-384x384.png',
          type: 'image/png',
        },
        {
          sizes: '512x512',
          src: '/icon-512x512.png',
          type: 'image/png',
        },
      ],
      name: '\uc694\uae30\ucf55\ucf55!',
      scope: '/',
      short_name: '\uc694\uae30\ucf55\ucf55!',
      start_url: `/?is-pwa=1${tag ? `&tag=${tag}` : ''}`,
      theme_color: '#ffffff',
    };
  }

  isCrawler(userAgent: string) {
    return userAgent.includes('scrap');
  }

  private getRawDocument(og: { image: string; title: string; url: string }) {
    return `<!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>요기콕콕!</title>
        <meta property="og:title" content="${og.title}">
        <meta property="og:site_name" content="요기콕콕!">
        <meta property="og:url" content="${og.url}">
        <meta property="og:description" content="링크를 눌러서 요기콕콕!앱을 설치하세요.">
        <meta property="og:type" content="profile">
        <meta property="og:image" content="${og.image}">
        <meta name="description" content="링크를 눌러서 요기콕콕!앱을 설치하세요." />
      </head>
      <body>
      </body>
    </html>`;
  }
}
