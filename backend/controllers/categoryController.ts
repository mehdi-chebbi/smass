import { Request, Response } from 'express';
import { prisma } from '../utils/db';

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { contents: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
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

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required.' });
    }

    // Check uniqueness
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] }
    });

    if (existing) {
      return res.status(400).json({ message: 'Category name or slug already exists.' });
    }

    const category = await prisma.category.create({
      data: { name, slug, description }
    });

    res.status(201).json({
      message: 'Category created successfully.',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Check uniqueness if changed
    if ((name && name !== existingCategory.name) || (slug && slug !== existingCategory.slug)) {
      const exists = await prisma.category.findFirst({
        where: {
          OR: [
            name && name !== existingCategory.name ? { name } : {},
            slug && slug !== existingCategory.slug ? { slug } : {}
          ],
          NOT: { id }
        }
      });

      if (exists) {
        return res.status(400).json({ message: 'Category name or slug already exists.' });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description }
    });

    res.json({
      message: 'Category updated successfully.',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
