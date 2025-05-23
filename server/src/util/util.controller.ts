import {
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { User } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.interface';

import { DocumentUtilService } from './document-util/document-util.service';
import { FileUtilService } from './file-util/file-util.service';

@Controller('util')
export class UtilController {
  constructor(
    private readonly fileUtilService: FileUtilService,
    private readonly documentUtilService: DocumentUtilService,
  ) {}

  @Get('/document/:referrer')
  async getDocument(
    @Param('referrer') referrer: string,
    @Headers('user-agent') userAgent: string,
    @Res() res: Response,
  ) {
    const isCrawler = this.documentUtilService.isCrawler(userAgent);
    if (isCrawler) {
      const document = await this.documentUtilService.getDocument(referrer);
      res.setHeader('Content-Type', 'text/html; charset=utf-8').send(document);
      return;
    }
    const clientUrl = `${process.env.CLIENT_URL}/?tag=${referrer}`;
    res.redirect(HttpStatus.TEMPORARY_REDIRECT, clientUrl);
    return;
  }

  @Get('/web-manifest')
  getWebManifest(@Headers('referer') referer: string) {
    const tag = referer ? new URL(referer).searchParams.get('tag') : null;
    return this.documentUtilService.getWebManifest(tag);
  }

  @Get('/health-check')
  healthCheck() {
    return 'OK';
  }

  @Post('/image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImageUrl'))
  async uploadImage(
    @User() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 4_000_000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const title = `${user.email}-${Date.now()}`;
    const resized = await this.fileUtilService.resizeImage(
      file.buffer,
      1080,
      1080,
    );
    const url = await this.fileUtilService.uploadAndGetUrl(
      resized,
      `${title}.webp`,
    );
    return url;
  }
}
