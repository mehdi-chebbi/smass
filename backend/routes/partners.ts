import { Router } from 'express';
import { prisma } from '../utils/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    res.json({ partners });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { order: 'asc' } });
    res.json({ partners });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, nameFr, slug, description, descriptionFr, logo, website, order, isActive } = req.body;
    if (!name || !slug || !logo) return res.status(400).json({ message: 'name, slug, logo are required.' });
    const existing = await prisma.partner.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ message: 'Slug already in use.' });
    const item = await prisma.partner.create({ data: { name, nameFr, slug, description, descriptionFr, logo, website, order: order || 0, isActive: isActive ?? true } });
    res.status(201).json({ message: 'Partner created.', partner: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.partner.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Partner not found.' });
    const data: any = { ...req.body };
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.partner.findUnique({ where: { slug: data.slug } });
      if (slugExists) return res.status(400).json({ message: 'Slug already in use.' });
    }
    const item = await prisma.partner.update({ where: { id: req.params.id }, data });
    res.json({ message: 'Partner updated.', partner: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.partner.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Partner not found.' });
    await prisma.partner.delete({ where: { id: req.params.id } });
    res.json({ message: 'Partner deleted.' });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
