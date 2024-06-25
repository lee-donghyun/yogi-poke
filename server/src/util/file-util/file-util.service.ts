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
      return `${process.env.SERVER_URL}/util/object/${fileName}`;
    } catch {
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFile(name: string) {
    try {
      const object = await this.minioClient.getObject(
        process.env.STORAGE_ASSET_BUCKET_ID,
        name,
      );
      return object;
    } catch {
      throw new HttpException('No Such File', HttpStatus.NOT_FOUND);
    }
  }
}
