import { Router } from 'express';
import { prisma } from '../utils/db';
import { authenticate, requireEditor } from '../middleware/auth';

const router = Router();

// GET /api/news (public)
router.get('/', async (req, res) => {
  try {
    const { page = '1', limit = '10', isEvent } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const where: any = { isPublished: true };
    if (isEvent !== undefined) where.isEvent = isEvent === 'true';
    const [news, total] = await Promise.all([
      prisma.newsItem.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (pageNum-1)*limitNum, take: limitNum }),
      prisma.newsItem.count({ where })
    ]);
    res.json({ news, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/news/all (admin)
router.get('/all', authenticate, requireEditor, async (req, res) => {
  try {
    const { page = '1', limit = '20', isEvent, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const where: any = {};
    if (isEvent !== undefined) where.isEvent = isEvent === 'true';
    if (search) where.OR = [{ title: { contains: search as string, mode: 'insensitive' } }, { titleFr: { contains: search as string, mode: 'insensitive' } }];
    const [news, total] = await Promise.all([
      prisma.newsItem.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (pageNum-1)*limitNum, take: limitNum }),
      prisma.newsItem.count({ where })
    ]);
    res.json({ news, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/news/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.newsItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: 'News not found.' });
    res.json({ news: item });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/news
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const { title, titleFr, slug, excerpt, excerptFr, content, contentFr, featuredImage, isPublished, isEvent, eventDate, attachments } = req.body;
    if (!title || !slug || !content) return res.status(400).json({ message: 'title, slug, content are required.' });
    const existing = await prisma.newsItem.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ message: 'Slug already in use.' });
    const item = await prisma.newsItem.create({
      data: {
        title, titleFr, slug, excerpt, excerptFr, content, contentFr,
        featuredImage,
        isPublished: isPublished || false,
        isEvent: isEvent || false,
        eventDate: eventDate ? new Date(eventDate) : null,
        attachments: attachments ? JSON.stringify(attachments) : null,
        publishedAt: isPublished ? new Date() : null
      }
    });
    res.status(201).json({ message: 'News created.', news: item });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error.' }); }
});

// PUT /api/news/:id
router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.newsItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'News not found.' });
    const { title, titleFr, slug, excerpt, excerptFr, content, contentFr, featuredImage, isPublished, isEvent, eventDate, attachments } = req.body;
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.newsItem.findUnique({ where: { slug } });
      if (slugExists) return res.status(400).json({ message: 'Slug already in use.' });
    }
    const item = await prisma.newsItem.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        titleFr: titleFr ?? existing.titleFr,
        slug: slug ?? existing.slug,
        excerpt: excerpt ?? existing.excerpt,
        excerptFr: excerptFr ?? existing.excerptFr,
        content: content ?? existing.content,
        contentFr: contentFr ?? existing.contentFr,
        featuredImage: featuredImage ?? existing.featuredImage,
        isPublished: isPublished ?? existing.isPublished,
        isEvent: isEvent ?? existing.isEvent,
        eventDate: eventDate !== undefined ? (eventDate ? new Date(eventDate) : null) : existing.eventDate,
        attachments: attachments !== undefined ? JSON.stringify(attachments) : existing.attachments,
        publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt
      }
    });
    res.json({ message: 'News updated.', news: item });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error.' }); }
});

// DELETE /api/news/:id
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const existing = await prisma.newsItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'News not found.' });
    await prisma.newsItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'News deleted.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
