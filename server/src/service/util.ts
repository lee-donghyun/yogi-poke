import { Storage } from '@google-cloud/storage';
import path from 'path';

const storage = new Storage({
  keyFilename: path.resolve(__dirname, '../../certification/gcp_key.json'),
});
const bucketId = process.env.ASSET_BUCKET_ID || 'ASSET_BUCKET_ID';

export const uploadAndGetStorageUrl = async (
  buffer: Buffer,
  { type, userName }: { type: string; userName: string }
) => {
  const fileName = `${userName}-${Date.now()}.${type}`;
  const assets = storage.bucket(bucketId);
  await assets.file(fileName).save(buffer);
  return `https://storage.googleapis.com/${bucketId}/${fileName}`;
};
