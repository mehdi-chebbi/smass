import { Request, Response } from 'express';
import { prisma } from '../utils/db';

// Get all map points
export const getAllPoints = async (req: Request, res: Response) => {
  try {
    const { layerId, category, active } = req.query;

    const where: any = {};
    if (layerId) where.layerId = layerId;
    if (category) where.category = category;
    if (active !== undefined) where.isActive = active === 'true';

    const points = await prisma.mapPoint.findMany({
      where,
      include: {
        layer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            color: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json({ points });
  } catch (error) {
    console.error('Error fetching map points:', error);
    res.status(500).json({ error: 'Failed to fetch map points' });
  }
};

// Get single point
export const getPointById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const point = await prisma.mapPoint.findUnique({
      where: { id },
      include: {
        layer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            color: true
          }
        }
      }
    });

    if (!point) {
      return res.status(404).json({ error: 'Point not found' });
    }

    res.json({ point });
  } catch (error) {
    console.error('Error fetching map point:', error);
    res.status(500).json({ error: 'Failed to fetch map point' });
  }
};

// Create point
export const createPoint = async (req: Request, res: Response) => {
  try {
    const {
      name,
      nameFr,
      description,
      descriptionFr,
      latitude,
      longitude,
      icon,
      color,
      size,
      popupTitle,
      popupContent,
      popupContentFr,
      category,
      layerId,
      isActive,
      order
    } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    }

    const point = await prisma.mapPoint.create({
      data: {
        name,
        nameFr,
        description,
        descriptionFr,
        latitude,
        longitude,
        icon,
        color: color || '#ff5722',
        size: size ?? 10,
        popupTitle,
        popupContent,
        popupContentFr,
        category,
        layerId,
        isActive: isActive ?? true,
        order: order ?? 0
      },
      include: {
        layer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            color: true
          }
        }
      }
    });

    res.status(201).json({ point });
  } catch (error) {
    console.error('Error creating map point:', error);
    res.status(500).json({ error: 'Failed to create map point' });
  }
};

// Update point
export const updatePoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existingPoint = await prisma.mapPoint.findUnique({
      where: { id }
    });

    if (!existingPoint) {
      return res.status(404).json({ error: 'Point not found' });
    }

    const point = await prisma.mapPoint.update({
      where: { id },
      data: {
        name: body.name,
        nameFr: body.nameFr,
        description: body.description,
        descriptionFr: body.descriptionFr,
        latitude: body.latitude,
        longitude: body.longitude,
        icon: body.icon,
        color: body.color,
        size: body.size,
        popupTitle: body.popupTitle,
        popupContent: body.popupContent,
        popupContentFr: body.popupContentFr,
        category: body.category,
        layerId: body.layerId,
        isActive: body.isActive,
        order: body.order
      },
      include: {
        layer: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            color: true
          }
        }
      }
    });

    res.json({ point });
  } catch (error) {
    console.error('Error updating map point:', error);
    res.status(500).json({ error: 'Failed to update map point' });
  }
};

// Delete point
export const deletePoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingPoint = await prisma.mapPoint.findUnique({
      where: { id }
    });

    if (!existingPoint) {
      return res.status(404).json({ error: 'Point not found' });
    }

    await prisma.mapPoint.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting map point:', error);
    res.status(500).json({ error: 'Failed to delete map point' });
  }
};
