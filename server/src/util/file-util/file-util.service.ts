import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client as MinioClient } from 'minio';

@Injectable()
export class FileUtilService implements OnModuleInit {
  private minioClient: MinioClient;
  async onModuleInit() {
    this.minioClient = new MinioClient({
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey: 'cGaxeb4LIXbEYXWeiGDW',
      secretKey: 'CnIDRgQtgpgjVy1qEpiA9JP0QdbtpxZ27saB2yCa',
    });
  }
  async uploadImageAndGetUrl(file: Express.Multer.File) {
    await this.minioClient.putObject(
      process.env.ASSET_BUCKET_ID,
      file.filename,
      file.buffer,
    );
    return `${process.env.SERVER_URL}/util/image/${file.filename}`;
  }

  async getImage(name: string) {
    const object = await this.minioClient.getObject(
      process.env.ASSET_BUCKET_ID,
      name,
    );
    return object;
  }
}
