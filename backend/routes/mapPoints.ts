import { Router } from 'express';
import { getAllPoints, getPointById, createPoint, updatePoint, deletePoint } from '../controllers/mapPointController';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

router.get('/', getAllPoints);
router.get('/:id', getPointById);
router.post('/', authenticate, requireEditor, createPoint);
router.put('/:id', authenticate, requireEditor, updatePoint);
router.delete('/:id', authenticate, requireEditor, deletePoint);

export default router;
