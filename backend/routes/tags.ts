import { Router } from 'express';
import {
  getAllTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tagController';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllTags);
router.get('/:slug', getTagBySlug);

// Protected routes
router.use(authenticate, requireEditor);

router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
