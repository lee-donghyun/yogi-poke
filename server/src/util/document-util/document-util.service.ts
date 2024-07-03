import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { read } from 'jimp';
import { FileUtilService } from '../file-util/file-util.service';
import { resolve } from 'path';
import { cwd } from 'process';

@Injectable()
export class DocumentUtilService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileUtilService: FileUtilService,
  ) {}
  getWebManifest(tag: string | null) {
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
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    };
  }

  isCrawler(userAgent: string) {
    return userAgent.includes('scrap');
  }

  async getDocument(tag: string | null) {
    const user = tag
      ? await this.prismaService.user.findUnique({
          where: { email: tag },
        })
      : null;
    if (!user) {
      return this.getRawDocument({
        title: '요기콕콕!',
        image: '/asset/logo.png',
      });
    }

    const logoImageJimp = await read(resolve(cwd(), 'public/logo.png'));
    const profileImageJimp = await read(
      user.profileImageUrl ?? resolve(cwd(), 'public/default_user_profile.png'),
    );
    profileImageJimp.resize(200, 200);
    const ogImageJimp = logoImageJimp.composite(
      profileImageJimp.circle(),
      logoImageJimp.getWidth() - 280,
      logoImageJimp.getHeight() / 2 - 100,
    );
    const buffer = await ogImageJimp.getBufferAsync('image/png');
    const ogImageUrl = await this.fileUtilService.uploadAndGetUrl(
      buffer,
      `og-image-${user.id}.png`,
    );
    return this.getRawDocument({
      title: `${user.name}님을 콕 찔러보세요.`,
      image: ogImageUrl,
    });
  }

  private getRawDocument(og: { title: string; image: string }) {
    return `<!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>요기콕콕!</title>
        <meta property="og:title" content="${og.title}">
        <meta property="og:site_name" content="요기콕콕!">
        <meta property="og:url" content="https://yogi-poke.vercel.app">
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
