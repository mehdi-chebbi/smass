import { Router } from 'express';
import { getAllLayers, getLayerById, createLayer, updateLayer, deleteLayer } from '../controllers/mapLayerController';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

router.get('/', getAllLayers);
router.get('/:id', getLayerById);
router.post('/', authenticate, requireEditor, createLayer);
router.put('/:id', authenticate, requireEditor, updateLayer);
router.delete('/:id', authenticate, requireEditor, deleteLayer);

export default router;
