import { Router } from 'express';
import { prisma } from '../utils/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const statistics = await prisma.statistic.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    res.json({ statistics });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const statistics = await prisma.statistic.findMany({ orderBy: { order: 'asc' } });
    res.json({ statistics });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { label, labelFr, value, unit, unitFr, icon, order, isActive } = req.body;
    if (!label || !value) return res.status(400).json({ message: 'label and value are required.' });
    const item = await prisma.statistic.create({ data: { label, labelFr, value, unit, unitFr, icon, order: order || 0, isActive: isActive ?? true } });
    res.status(201).json({ message: 'Statistic created.', statistic: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.statistic.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Statistic not found.' });
    const item = await prisma.statistic.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: 'Statistic updated.', statistic: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.statistic.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Statistic not found.' });
    await prisma.statistic.delete({ where: { id: req.params.id } });
    res.json({ message: 'Statistic deleted.' });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
