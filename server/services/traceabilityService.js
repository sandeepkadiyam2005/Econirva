import crypto from 'node:crypto';
import { prisma } from '../config/database.js';

export const createMaterialBatch = ({ tenantId, batchCode, originCountry, supplierName, sustainabilityData }) =>
  prisma.materialBatch.create({
    data: {
      tenantId,
      batchCode,
      originCountry,
      supplierName,
      sustainabilityData: sustainabilityData || {},
    },
  });

export const issueCertificate = async ({ tenantId, certificateNo, standard, issuedBy, metadata }) => {
  const proofHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ tenantId, certificateNo, standard, issuedBy, metadata, issuedAt: Date.now() }))
    .digest('hex');

  return prisma.sustainabilityCertificate.create({
    data: {
      tenantId,
      certificateNo,
      standard,
      issuedBy,
      proofHash,
      metadata: metadata || {},
    },
  });
};
