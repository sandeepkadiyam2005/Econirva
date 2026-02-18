import multer from 'multer';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, WEBP, and SVG files are allowed.'));
  }
  return cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
