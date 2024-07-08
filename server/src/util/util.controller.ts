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
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileUtilService } from './file-util/file-util.service';
import { JwtPayload } from 'src/auth/auth.interface';
import { User } from 'src/auth/auth.decorator';
import { DocumentUtilService } from './document-util/document-util.service';
import { Response } from 'express';

@Controller('util')
export class UtilController {
  constructor(
    private readonly fileUtilService: FileUtilService,
    private readonly documentUtilService: DocumentUtilService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImageUrl'))
  @Post('/image')
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
    const type = file.mimetype.split('/')[1];
    const title = `${user.email}-${Date.now()}`;
    const filename = `${title}.${type}`;
    const url = await this.fileUtilService.uploadAndGetUrl(
      file.buffer,
      filename,
    );
    return url;
  }

  @Get('/web-manifest')
  async getWebManifest(@Headers('referer') referer: string) {
    const tag = referer ? new URL(referer).searchParams.get('tag') : null;
    return this.documentUtilService.getWebManifest(tag);
  }

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

  @Get('/health-check')
  async healthCheck() {
    return 'OK';
  }
}
