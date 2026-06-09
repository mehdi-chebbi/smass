import { Request, Response } from 'express';
import { prisma } from '../utils/db';

export const getAllLayers = async (req: Request, res: Response) => {
  try {
    const { visible, withPoints } = req.query;
    const where: any = {};
    if (visible !== undefined) where.isVisible = visible === 'true';

    const layers = await prisma.mapLayer.findMany({
      where,
      include: withPoints === 'true'
        ? { points: { where: { isActive: true }, orderBy: { order: 'asc' } } }
        : { _count: { select: { points: true } } },
      orderBy: { order: 'asc' },
    });
    res.json({ layers });
  } catch (error) {
    console.error('Error fetching map layers:', error);
    res.status(500).json({ error: 'Failed to fetch map layers' });
  }
};

export const getLayerById = async (req: Request, res: Response) => {
  try {
    const layer = await prisma.mapLayer.findUnique({
      where: { id: req.params.id },
      include: { points: { where: { isActive: true }, orderBy: { order: 'asc' } } },
    });
    if (!layer) return res.status(404).json({ error: 'Layer not found' });
    res.json({ layer });
  } catch (error) {
    console.error('Error fetching map layer:', error);
    res.status(500).json({ error: 'Failed to fetch map layer' });
  }
};

// Helper to parse layer body — handles all new style fields
function parseLayerBody(body: any) {
  return {
    name: body.name,
    nameFr: body.nameFr || null,
    description: body.description || null,
    descriptionFr: body.descriptionFr || null,
    layerType: body.layerType || 'VECTOR',
    color: body.color || '#3388ff',
    fillColor: body.fillColor || null,
    fillOpacity: body.fillOpacity != null ? parseFloat(body.fillOpacity) : 0.35,
    opacity: body.opacity != null ? parseFloat(body.opacity) : 0.8,
    borderColor: body.borderColor || null,
    borderOpacity: body.borderOpacity != null ? parseFloat(body.borderOpacity) : 1.0,
    weight: body.weight != null ? parseInt(body.weight) : 2,
    showLabels: body.showLabels ?? false,
    labelField: body.labelField || null,
    labelFontSize: body.labelFontSize != null ? parseInt(body.labelFontSize) : 12,
    categorize: body.categorize ?? false,
    categorizeField: body.categorizeField || null,
    isVisible: body.isVisible ?? true,
    isDefault: body.isDefault ?? false,
    order: body.order != null ? parseInt(body.order) : 0,
    source: body.source || null,
    attribution: body.attribution || null,
    minLat: body.minLat != null ? parseFloat(body.minLat) : null,
    maxLat: body.maxLat != null ? parseFloat(body.maxLat) : null,
    minLng: body.minLng != null ? parseFloat(body.minLng) : null,
    maxLng: body.maxLng != null ? parseFloat(body.maxLng) : null,
  };
}

export const createLayer = async (req: Request, res: Response) => {
  try {
    const { name, slug, geoData } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });

    const existing = await prisma.mapLayer.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ error: 'Layer with this slug already exists' });

    const layer = await prisma.mapLayer.create({
      data: {
        slug,
        geoData: geoData || '{"type":"FeatureCollection","features":[]}',
        fileName: req.body.fileName || null,
        fileSize: req.body.fileSize != null ? parseInt(req.body.fileSize) : null,
        ...parseLayerBody(req.body),
      },
    });
    res.status(201).json({ layer });
  } catch (error) {
    console.error('Error creating map layer:', error);
    res.status(500).json({ error: 'Failed to create map layer' });
  }
};

export const updateLayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.mapLayer.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Layer not found' });

    const layer = await prisma.mapLayer.update({
      where: { id },
      data: {
        ...parseLayerBody(req.body),
        geoData: req.body.geoData ?? existing.geoData,
        fileName: req.body.fileName ?? existing.fileName,
        fileSize: req.body.fileSize != null ? parseInt(req.body.fileSize) : existing.fileSize,
      },
    });
    res.json({ layer });
  } catch (error) {
    console.error('Error updating map layer:', error);
    res.status(500).json({ error: 'Failed to update map layer' });
  }
};

export const deleteLayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.mapLayer.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Layer not found' });

    await prisma.mapPoint.deleteMany({ where: { layerId: id } });
    await prisma.mapLayer.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting map layer:', error);
    res.status(500).json({ error: 'Failed to delete map layer' });
  }
};
