import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      sort = 'featured',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { subtitle: { contains: search as string } },
      ];
    }

    if (category) {
      where.category = { slug: category as string };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating as string) };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'featured') orderBy = { isFeatured: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      specs: JSON.parse(p.specs),
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({
      ...product,
      images: JSON.parse(product.images),
      specs: JSON.parse(product.specs),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      description,
      price,
      compareAtPrice,
      stock,
      categoryId,
      images,
      specs,
      isFeatured,
      isNew,
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        subtitle,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock, 10),
        categoryId,
        images: typeof images === 'string' ? images : JSON.stringify(images),
        specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
        isFeatured: Boolean(isFeatured),
        isNew: Boolean(isNew),
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = { ...req.body };

    if (data.price) data.price = parseFloat(data.price);
    if (data.compareAtPrice) data.compareAtPrice = parseFloat(data.compareAtPrice);
    if (data.stock) data.stock = parseInt(data.stock, 10);
    if (data.images && typeof data.images !== 'string') data.images = JSON.stringify(data.images);
    if (data.specs && typeof data.specs !== 'string') data.specs = JSON.stringify(data.specs);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
