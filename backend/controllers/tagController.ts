import { Request, Response } from 'express';
import { prisma } from '../utils/db';

// Get all tags
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { contents: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ tags });
  } catch (error) {
    console.error('Get all tags error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get tag by slug
export const getTagBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        contents: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true
          }
        }
      }
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found.' });
    }

    res.json({ tag });
  } catch (error) {
    console.error('Get tag by slug error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required.' });
    }

    // Check uniqueness
    const existing = await prisma.tag.findFirst({
      where: { OR: [{ name }, { slug }] }
    });

    if (existing) {
      return res.status(400).json({ message: 'Tag name or slug already exists.' });
    }

    const tag = await prisma.tag.create({
      data: { name, slug }
    });

    res.status(201).json({
      message: 'Tag created successfully.',
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update tag
export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return res.status(404).json({ message: 'Tag not found.' });
    }

    // Check uniqueness if changed
    if ((name && name !== existingTag.name) || (slug && slug !== existingTag.slug)) {
      const exists = await prisma.tag.findFirst({
        where: {
          OR: [
            name && name !== existingTag.name ? { name } : {},
            slug && slug !== existingTag.slug ? { slug } : {}
          ],
          NOT: { id }
        }
      });

      if (exists) {
        return res.status(400).json({ message: 'Tag name or slug already exists.' });
      }
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: { name, slug }
    });

    res.json({
      message: 'Tag updated successfully.',
      tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return res.status(404).json({ message: 'Tag not found.' });
    }

    await prisma.tag.delete({
      where: { id }
    });

    res.json({ message: 'Tag deleted successfully.' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
