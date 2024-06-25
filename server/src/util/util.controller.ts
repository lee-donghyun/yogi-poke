import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
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

@Controller('util')
export class UtilController {
  constructor(private readonly fileUtilService: FileUtilService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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
    file.filename = `${title}.${type}`;
    const url = await this.fileUtilService.uploadImageAndGetUrl(file);
    return url;
  }

  @Get('/image/:filename')
  async getImage(@Param('filename') filename: string) {
    const file = await this.fileUtilService.getImage(filename);
    return new StreamableFile(file);
  }
}
