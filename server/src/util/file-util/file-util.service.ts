import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Client as MinioClient } from 'minio';
import sharp from 'sharp';

@Injectable()
export class FileUtilService implements OnModuleInit {
  private minioClient: MinioClient;
  onModuleInit() {
    this.minioClient = new MinioClient({
      accessKey: process.env.STORAGE_ACCESS_KEY,
      endPoint: process.env.STORAGE_ENDPOINT,
      port: Number(process.env.STORAGE_PORT ?? 9000),
      secretKey: process.env.STORAGE_SECRET_KEY,
      useSSL: false,
    });
  }
  async resizeImage(buffer: Buffer, width: number, height: number) {
    return await sharp(buffer).resize(width, height).webp().toBuffer();
  }
  async uploadAndGetUrl(buffer: Buffer, fileName: string) {
    try {
      await this.minioClient.putObject(
        process.env.STORAGE_ASSET_BUCKET_ID,
        fileName,
        buffer,
      );
      return `https://d3gu28ipwoewpm.cloudfront.net/${process.env.STORAGE_ASSET_BUCKET_ID}/${fileName}`;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
