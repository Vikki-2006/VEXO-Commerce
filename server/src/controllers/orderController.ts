import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, couponCode, shippingFee = 0 } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    let subtotal = 0;
    const orderItemsToCreate = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItemsToCreate.push({
        productId: product.id,
        price: product.price,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
      });
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
    const orderNumber = 'AURA-' + Math.floor(100000 + Math.random() * 900000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user!.id,
        totalAmount,
        discountAmount,
        shippingFee,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        items: {
          create: orderItemsToCreate,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    const formattedOrders = orders.map((ord) => ({
      ...ord,
      shippingAddress: JSON.parse(ord.shippingAddress),
    }));

    res.json(formattedOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        items: { include: { product: true } },
      },
    });

    const formatted = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
