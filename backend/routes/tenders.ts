import { Router } from 'express';
import { prisma } from '../utils/db';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (status) where.status = status;
    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({ where, orderBy: { deadline: 'asc' }, skip, take: limitNum }),
      prisma.tender.count({ where })
    ]);
    res.json({ tenders, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.tender.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: 'Tender not found.' });
    res.json({ tender: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const { title, titleFr, slug, description, descriptionFr, reference, type, status, deadline, openingDate, documentUrl, contactName, contactEmail, contactPhone, budget, currency } = req.body;
    if (!title || !slug || !deadline) return res.status(400).json({ message: 'title, slug, deadline are required.' });
    const existing = await prisma.tender.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ message: 'Slug already in use.' });
    const item = await prisma.tender.create({
      data: { title, titleFr, slug, description, descriptionFr, reference, type: type || 'SERVICE', status: status || 'OPEN', deadline: new Date(deadline), openingDate: openingDate ? new Date(openingDate) : null, documentUrl, contactName, contactEmail, contactPhone, budget: budget ? parseFloat(budget) : null, currency }
    });
    res.status(201).json({ message: 'Tender created.', tender: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.tender.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Tender not found.' });
    const data: any = { ...req.body };
    if (data.deadline) data.deadline = new Date(data.deadline);
    if (data.openingDate) data.openingDate = new Date(data.openingDate);
    if (data.budget) data.budget = parseFloat(data.budget);
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.tender.findUnique({ where: { slug: data.slug } });
      if (slugExists) return res.status(400).json({ message: 'Slug already in use.' });
    }
    const item = await prisma.tender.update({ where: { id }, data });
    res.json({ message: 'Tender updated.', tender: item });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const existing = await prisma.tender.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Tender not found.' });
    await prisma.tender.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tender deleted.' });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
