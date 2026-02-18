import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
const localUploadDir = path.resolve('server/uploads');

const useS3 = String(process.env.STORAGE_PROVIDER || 'local').toLowerCase() === 's3';

const s3Client = useS3
  ? new S3Client({
      region: process.env.AWS_REGION,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
      endpoint: process.env.AWS_S3_ENDPOINT || undefined,
      forcePathStyle: String(process.env.AWS_S3_FORCE_PATH_STYLE || 'false') === 'true',
    })
  : null;

const ensureLocalDir = () => {
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }
};

const sanitizeFileName = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();

const buildObjectKey = (tenantId, fileName) => {
  const uniquePrefix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  return `tenants/${tenantId}/orders/${uniquePrefix}-${sanitizeFileName(fileName)}`;
};

const publicUrlForS3 = (key) => {
  if (process.env.AWS_S3_PUBLIC_URL) {
    return `${process.env.AWS_S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  }

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const uploadFile = async ({ tenantId, file }) => {
  if (!file) return null;

  if (!allowedMimeTypes.has(file.mimetype)) {
    throw { status: 400, message: 'Only JPEG, PNG, WEBP, and SVG files are allowed.' };
  }

  if (useS3) {
    if (!process.env.AWS_S3_BUCKET) {
      throw { status: 500, message: 'AWS_S3_BUCKET is required for S3 storage provider.' };
    }

    const key = buildObjectKey(tenantId, file.originalname);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
        ServerSideEncryption: process.env.S3_SERVER_SIDE_ENCRYPTION || 'AES256',
      })
    );

    return {
      key,
      url: publicUrlForS3(key),
      provider: 's3',
    };
  }

  ensureLocalDir();
  const extension = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, extension);
  const fileName = `${Date.now()}-${sanitizeFileName(baseName)}${extension}`;
  const destination = path.join(localUploadDir, fileName);
  fs.writeFileSync(destination, file.buffer);

  return {
    key: fileName,
    url: `/uploads/${fileName}`,
    provider: 'local',
  };
};
