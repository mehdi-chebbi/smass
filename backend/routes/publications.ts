import { Router } from 'express';
import { prisma } from '../utils/db';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

// GET /api/publications (public)
router.get('/', async (req, res) => {
  try {
    const { type, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const where: any = { isPublished: true };
    if (type) where.publicationType = type;
    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        orderBy: [{ order: 'asc' }, { date: 'desc' }, { createdAt: 'desc' }],
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.publication.count({ where })
    ]);
    res.json({ publications, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (e) { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/publications/all (admin)
router.get('/all', authenticate, requireEditor, async (req, res) => {
  try {
    const { type, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const where: any = {};
    if (type) where.publicationType = type;
    if (search) where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { titleFr: { contains: search as string, mode: 'insensitive' } },
    ];
    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.publication.count({ where })
    ]);
    res.json({ publications, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (e) { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/publications/:id
router.get('/:id', async (req, res) => {
  try {
    const pub = await prisma.publication.findUnique({ where: { id: req.params.id } });
    if (!pub) return res.status(404).json({ message: 'Publication not found.' });
    res.json({ publication: pub });
  } catch (e) { res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/publications
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const { title, titleFr, slug, description, descriptionFr, publicationType, isPublished, coverImage, files, date, authors, language, order } = req.body;
    if (!title || !slug) return res.status(400).json({ message: 'title and slug are required.' });
    const existing = await prisma.publication.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ message: 'Slug already in use.' });
    const pub = await prisma.publication.create({
      data: {
        title, titleFr, slug, description, descriptionFr,
        publicationType: publicationType || 'REPORT',
        isPublished: isPublished || false,
        coverImage,
        files: files ? JSON.stringify(files) : null,
        date: date ? new Date(date) : null,
        authors, language: language || 'EN/FR',
        order: order || 0,
        publishedAt: isPublished ? new Date() : null
      }
    });
    res.status(201).json({ message: 'Publication created.', publication: pub });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error.' }); }
});

// PUT /api/publications/:id
router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Publication not found.' });
    const { title, titleFr, slug, description, descriptionFr, publicationType, isPublished, coverImage, files, date, authors, language, order } = req.body;
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.publication.findUnique({ where: { slug } });
      if (slugExists) return res.status(400).json({ message: 'Slug already in use.' });
    }
    const pub = await prisma.publication.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        titleFr: titleFr ?? existing.titleFr,
        slug: slug ?? existing.slug,
        description: description ?? existing.description,
        descriptionFr: descriptionFr ?? existing.descriptionFr,
        publicationType: publicationType ?? existing.publicationType,
        isPublished: isPublished ?? existing.isPublished,
        coverImage: coverImage ?? existing.coverImage,
        files: files !== undefined ? JSON.stringify(files) : existing.files,
        date: date ? new Date(date) : existing.date,
        authors: authors ?? existing.authors,
        language: language ?? existing.language,
        order: order ?? existing.order,
        publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt
      }
    });
    res.json({ message: 'Publication updated.', publication: pub });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error.' }); }
});

// DELETE /api/publications/:id
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const existing = await prisma.publication.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Publication not found.' });
    await prisma.publication.delete({ where: { id: req.params.id } });
    res.json({ message: 'Publication deleted.' });
  } catch (e) { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
