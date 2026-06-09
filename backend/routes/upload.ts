import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

// Allowed MIME types
const ALLOWED_TYPES: Record<string, string> = {
  // Images
  'image/jpeg': 'images',
  'image/jpg': 'images',
  'image/png': 'images',
  'image/gif': 'images',
  'image/webp': 'images',
  'image/svg+xml': 'images',
  // PDFs
  'application/pdf': 'pdfs',
  // Videos
  'video/mp4': 'videos',
  'video/webm': 'videos',
  'video/ogg': 'videos',
  'video/avi': 'videos',
  'video/quicktime': 'videos',
  'video/x-msvideo': 'videos',
  // Documents
  'application/msword': 'docs',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs',
  'application/vnd.ms-excel': 'docs',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'docs',
  'application/vnd.ms-powerpoint': 'docs',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'docs',
  'text/plain': 'docs',
  'application/zip': 'docs',
};

// Universal storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdir = ALLOWED_TYPES[file.mimetype] || 'misc';
    const dir = path.join(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'), subdir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9\-_]/g, '-').slice(0, 60);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}. Allowed: images, PDF, video, Word, Excel, PowerPoint.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max (for videos)
});

// POST /api/upload  — universal single file upload
router.post('/', authenticate, requireEditor, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const subdir = ALLOWED_TYPES[req.file.mimetype] || 'misc';
  const fileUrl = `/uploads/${subdir}/${req.file.filename}`;
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  res.status(201).json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      url: fileUrl,
      absoluteUrl: `${backendUrl}${fileUrl}`,
      type: subdir
    }
  });
});

// POST /api/upload/pdf (legacy)
router.post('/pdf', authenticate, requireEditor, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No PDF file uploaded.' });
  const fileUrl = `/uploads/pdfs/${req.file.filename}`;
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  res.status(201).json({ message: 'PDF uploaded successfully', file: { filename: req.file.filename, originalName: req.file.originalname, size: req.file.size, mimeType: req.file.mimetype, url: fileUrl, absoluteUrl: `${backendUrl}${fileUrl}` } });
});

// POST /api/upload/image (legacy)
router.post('/image', authenticate, requireEditor, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
  const fileUrl = `/uploads/images/${req.file.filename}`;
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  res.status(201).json({ message: 'Image uploaded successfully', file: { filename: req.file.filename, originalName: req.file.originalname, size: req.file.size, mimeType: req.file.mimetype, url: fileUrl, absoluteUrl: `${backendUrl}${fileUrl}` } });
});

// DELETE /api/upload/:subdir/:filename
router.delete('/:subdir/:filename', authenticate, requireEditor, (req: Request, res: Response) => {
  const { subdir, filename } = req.params;
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ message: 'Invalid filename.' });
  }
  const filePath = path.join((process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')) as string, subdir as string, filename as string);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }
  fs.unlinkSync(filePath);
  res.json({ message: 'File deleted successfully.' });
});

// Multer error handler
router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max 500MB.' });
  }
  if (err) return res.status(400).json({ message: err.message });
  next();
});

export default router;
