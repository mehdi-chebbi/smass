import { Request, Response } from 'express';
import { prisma } from '../utils/db';

// Get all contents (with filters)
export const getAllContents = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      contentType, 
      categoryId, 
      search,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (contentType) where.contentType = contentType;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              country: true
            }
          },
          category: true,
          tags: true,
          _count: {
            select: { attachments: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.content.count({ where })
    ]);

    res.json({
      contents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all contents error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get content by slug
export const getContentBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            country: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        category: true,
        tags: true,
        attachments: true
      }
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    res.json({ content });
  } catch (error) {
    console.error('Get content by slug error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create content
export const createContent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content: contentBody,
      contentType,
      status,
      featuredImage,
      metaTitle,
      metaDescription,
      keywords,
      categoryId,
      tagIds,
      publishedAt
    } = req.body;

    // Validation
    if (!title || !slug || !contentBody || !contentType) {
      return res.status(400).json({ 
        message: 'Title, slug, content, and contentType are required.' 
      });
    }

    // Check slug uniqueness
    const existingContent = await prisma.content.findUnique({
      where: { slug }
    });

    if (existingContent) {
      return res.status(400).json({ message: 'Slug already in use.' });
    }

    const authorId = req.user?.id;

    const newContent = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt,
        content: contentBody,
        contentType,
        status: status || 'DRAFT',
        featuredImage,
        metaTitle,
        metaDescription,
        keywords: keywords || [],
        authorId,
        categoryId,
        publishedAt: publishedAt || (status === 'PUBLISHED' ? new Date() : null),
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        category: true,
        tags: true
      }
    });

    res.status(201).json({
      message: 'Content created successfully.',
      content: newContent
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update content
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content: contentBody,
      contentType,
      status,
      featuredImage,
      metaTitle,
      metaDescription,
      keywords,
      categoryId,
      tagIds,
      publishedAt
    } = req.body;

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existingContent.slug) {
      const slugExists = await prisma.content.findUnique({
        where: { slug }
      });
      if (slugExists) {
        return res.status(400).json({ message: 'Slug already in use.' });
      }
    }

    const updaterId = req.user?.id;

    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        title: title || existingContent.title,
        slug: slug || existingContent.slug,
        excerpt: excerpt !== undefined ? excerpt : existingContent.excerpt,
        content: contentBody || existingContent.content,
        contentType: contentType || existingContent.contentType,
        status: status || existingContent.status,
        featuredImage: featuredImage !== undefined ? featuredImage : existingContent.featuredImage,
        metaTitle: metaTitle !== undefined ? metaTitle : existingContent.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingContent.metaDescription,
        keywords: keywords || existingContent.keywords,
        categoryId: categoryId !== undefined ? categoryId : existingContent.categoryId,
        updaterId,
        publishedAt: publishedAt || (status === 'PUBLISHED' && existingContent.status !== 'PUBLISHED' ? new Date() : existingContent.publishedAt),
        tags: tagIds ? {
          set: [],
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        category: true,
        tags: true
      }
    });

    res.json({
      message: 'Content updated successfully.',
      content: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete content
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingContent = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    await prisma.content.delete({
      where: { id }
    });

    res.json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get published contents (public)
export const getPublishedContents = async (req: Request, res: Response) => {
  try {
    const { contentType, categoryId, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status: 'PUBLISHED' };
    if (contentType) where.contentType = contentType;
    if (categoryId) where.categoryId = categoryId;

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          contentType: true,
          publishedAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
              country: true
            }
          },
          category: true,
          tags: true
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.content.count({ where })
    ]);

    res.json({
      contents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get published contents error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
