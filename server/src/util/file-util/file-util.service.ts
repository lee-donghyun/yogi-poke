import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Client as MinioClient } from 'minio';

@Injectable()
export class FileUtilService implements OnModuleInit {
  private minioClient: MinioClient;
  async onModuleInit() {
    this.minioClient = new MinioClient({
      endPoint: process.env.STORAGE_ENDPOINT,
      port: Number(process.env.STORAGE_PORT ?? 9000),
      useSSL: false,
      accessKey: process.env.STORAGE_ACCESS_KEY,
      secretKey: process.env.STORAGE_SECRET_KEY,
    });
  }
  async uploadAndGetUrl(buffer: Buffer, fileName: string) {
    try {
      await this.minioClient.putObject(
        process.env.STORAGE_ASSET_BUCKET_ID,
        fileName,
        buffer,
      );
      return `https://static.is-not-a.store/${process.env.STORAGE_ASSET_BUCKET_ID}/${fileName}`;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
