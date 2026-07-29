import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'Product ID, rating, and comment are required' });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user!.id,
        productId,
        rating: parseInt(rating, 10),
        title,
        comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update product rating and reviewsCount
    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: allReviews.length,
      },
    });

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.productId as string;
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
