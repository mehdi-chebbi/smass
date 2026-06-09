import { Router } from 'express';
import {
  getAllContents,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  getPublishedContents
} from '../controllers/contentController';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

// Public routes - must come before protected routes
router.get('/published', getPublishedContents);
router.get('/published/:slug', getContentBySlug);

// Protected routes (require editor or admin)
router.get('/', authenticate, requireEditor, getAllContents);
router.get('/:id', authenticate, requireEditor, getContentBySlug);
router.post('/', authenticate, requireEditor, createContent);
router.put('/:id', authenticate, requireEditor, updateContent);
router.delete('/:id', authenticate, requireEditor, deleteContent);

export default router;
