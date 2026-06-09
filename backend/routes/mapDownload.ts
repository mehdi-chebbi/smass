import { Router, Request, Response } from 'express';
import { prisma } from '../utils/db';

const router = Router();

// GET /api/map/download?layerId=xxx&format=geojson
router.get('/', async (req: Request, res: Response) => {
  try {
    const { layerId, format = 'geojson' } = req.query as Record<string, string>;
    if (!layerId) return res.status(400).json({ error: 'layerId is required' });

    const layer = await prisma.mapLayer.findUnique({ where: { id: layerId } });
    if (!layer) return res.status(404).json({ error: 'Layer not found' });

    if (format === 'geojson' || format === 'json') {
      const data = typeof layer.geoData === 'string' ? layer.geoData : JSON.stringify(layer.geoData);
      const filename = `${layer.slug}.geojson`;
      res.setHeader('Content-Type', 'application/geo+json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(data);
    }

    return res.status(400).json({ error: `Format "${format}" not supported. Use: geojson, json` });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download layer' });
  }
});

export default router;
