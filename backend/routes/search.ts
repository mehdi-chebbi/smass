import { Router, Request, Response } from 'express';
import { prisma } from '../utils/db';

const router = Router();

// GET /api/search?q=...&type=all|content|news&page=1&limit=10
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    const type = (req.query.type as string) || 'all';
    const page = Math.max(1, parseInt(req.query.page as string || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string || '10')));
    const skip = (page - 1) * limit;

    if (q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const [contentResults, newsResults] = await Promise.all([
      (type === 'all' || type === 'content')
        ? prisma.content.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { titleFr: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
                { content: { contains: q, mode: 'insensitive' } },
              ],
              status: 'PUBLISHED',
            },
            select: { id: true, title: true, titleFr: true, excerpt: true, slug: true, contentType: true, createdAt: true, status: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
          })
        : Promise.resolve([]),

      (type === 'all' || type === 'news')
        ? prisma.newsItem.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { titleFr: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
              ],
              isPublished: true,
            },
            select: { id: true, title: true, titleFr: true, excerpt: true, slug: true, isPublished: true, isEvent: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
          })
        : Promise.resolve([]),
    ]);

    res.json({
      query: q,
      results: { content: contentResults, news: newsResults, total: contentResults.length + newsResults.length },
      pagination: { page, limit },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
