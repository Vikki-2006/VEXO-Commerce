import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for VEXO Systems (INR Pricing)...');

  // Clean existing database records
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@vexo.systems',
      name: 'Julian Vance',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'user@vexo.systems',
      name: 'Astrid Lindqvist',
      password: userPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      addresses: {
        create: [
          {
            type: 'SHIPPING',
            street: 'Strandvägen 45',
            city: 'Stockholm',
            state: 'ST',
            zipCode: '114 56',
            country: 'Sweden',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('✅ Users created: Admin (admin@vexo.systems) and Customer (user@vexo.systems)');

  // 2. Create VEXO Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Acoustic Architecture',
        slug: 'acoustic-architecture',
        description: 'Studio-grade planar magnetic audio transducers and precision noise isolation.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Visual Displays',
        slug: 'visual-displays',
        description: 'Master calibration QD-OLED displays with 99% DCI-P3 color accuracy.',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tactile Inputs',
        slug: 'tactile-inputs',
        description: 'CNC 6063 aluminum gasket-mount mechanical keydecks and magnetic actuation.',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Carry & Apparel',
        slug: 'carry-apparel',
        description: 'Minimalist techwear carry, ballistic waterproof nylon, and anodized hardware.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Power & Infrastructure',
        slug: 'power-infrastructure',
        description: 'Gallium Nitride III power stations and precision desk architectural pads.',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000',
      },
    }),
  ]);

  const [catAudio, catDisplay, catKeyboard, catApparel, catPower] = categories;

  // 3. Create Premium VEXO Hardware Products (INR Prices)
  const productsData = [
    {
      title: 'VEXO Soundstage One Headphones',
      slug: 'vexo-soundstage-one',
      subtitle: 'Planar magnetic acoustic drivers with hybrid active noise isolation.',
      description: 'Hand-assembled in Stockholm. Features custom 50mm beryllium composite planar transducers, 50-hour continuous battery playback, zero-loss wireless streaming, and lambskin ear cushions.',
      price: 41999,
      compareAtPrice: 45999,
      stock: 30,
      categoryId: catAudio.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200',
      ]),
      specs: JSON.stringify({
        'Acoustic Driver': '50mm Beryllium Planar Magnetic',
        'Frequency Response': '5Hz – 45,000Hz',
        'Total Harmonic Distortion': '< 0.05% @ 1kHz',
        'Battery Endurance': '50 Hours (ANC Enabled)',
        'Frame Construction': 'Anodized 6063 Aluminum',
      }),
      isFeatured: true,
      isNew: true,
      rating: 4.95,
      reviewsCount: 142,
    },
    {
      title: 'VEXO Vision 32 Master Monitor',
      slug: 'vexo-vision-32-master',
      subtitle: '32-inch 4K QD-OLED, 240Hz, 0.03ms GTG, 1000-nit peak HDR.',
      description: 'Engineered for colorists and designers demanding absolute visual fidelity. Boasts a passive graphite thermal dissipation plate, 90W USB-C power delivery, and factory Delta E < 1 calibration.',
      price: 124999,
      compareAtPrice: 139999,
      stock: 12,
      categoryId: catDisplay.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=1200',
      ]),
      specs: JSON.stringify({
        'Panel Technology': '32-inch Quantum Dot OLED',
        'Native Resolution': '3840 x 2160 pixels (4K UHD)',
        'Refresh Frequency': '240Hz Variable',
        'Color Spectrum': '99% DCI-P3, 10-bit Native',
        'Enclosure': 'Solid CNC Aluminum Unibody',
      }),
      isFeatured: true,
      isNew: true,
      rating: 4.98,
      reviewsCount: 88,
    },
    {
      title: 'VEXO Haptic Gasket Keydeck',
      slug: 'vexo-haptic-gasket-keydeck',
      subtitle: 'Leaf-spring gasket mount, Hall Effect magnetic switches, 8000Hz polling.',
      description: 'Precision milled from a single 3.2kg block of aerospace aluminum. Features magnetic rapid-trigger switches with 0.1mm actuation customizability.',
      price: 24999,
      compareAtPrice: 28999,
      stock: 45,
      categoryId: catKeyboard.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1200',
      ]),
      specs: JSON.stringify({
        'Chassis': 'CNC Anodized 6063 Aluminum',
        'Switches': 'VEXO Magnetic Hall Effect',
        'Polling Rate': '8000Hz Ultra-Low Latency',
        'Weight': '2.4 kg (Solid)',
      }),
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      reviewsCount: 175,
    },
    {
      title: 'VEXO Field Pack 25L',
      slug: 'vexo-field-pack-25l',
      subtitle: 'X-Pac VX21 waterproof fabric with Fidlock V-buckle magnetic locks.',
      description: 'Minimalist tactical carry for modern technologists. Houses up to a 16-inch laptop in a suspended shock-absorbing vault.',
      price: 18999,
      compareAtPrice: 21999,
      stock: 25,
      categoryId: catApparel.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1200',
      ]),
      specs: JSON.stringify({
        'Volume': '25 Liters',
        'Shell Material': 'Waterproof X-Pac VX21',
        'Hardware': 'German Fidlock Magnetic Buckles',
      }),
      isFeatured: false,
      isNew: true,
      rating: 4.85,
      reviewsCount: 64,
    },
    {
      title: 'VEXO Modular GaN 140W Station',
      slug: 'vexo-modular-gan-140w',
      subtitle: '4-Port USB-C/A charging hub with OLED real-time power telemetry.',
      description: 'Next-generation Gallium Nitride III power architecture. Delivers simultaneous 140W Power Delivery 3.1 to laptops and mobile devices.',
      price: 9999,
      compareAtPrice: 11999,
      stock: 90,
      categoryId: catPower.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200',
      ]),
      specs: JSON.stringify({
        'Max Power': '140W USB-C PD 3.1',
        'Ports': '3x USB-C, 1x USB-A Fast Charge',
        'Display': 'Monochrome OLED Telemetry',
      }),
      isFeatured: true,
      isNew: false,
      rating: 4.92,
      reviewsCount: 110,
    },
  ];

  for (const prod of productsData) {
    const createdProduct = await prisma.product.create({
      data: prod,
    });

    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: createdProduct.id,
        rating: 5,
        title: 'Industrial design masterpiece',
        comment: 'VEXO has redefined what luxury hardware feels like. The acoustic response and physical tactile weight are unmatched.',
        isVerified: true,
      },
    });
  }

  console.log(`✅ Created ${productsData.length} VEXO flagship products with INR pricing.`);

  // 4. Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'VEXO20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 10000,
      maxUses: 500,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'LAUNCH50',
      discountType: 'FIXED',
      discountValue: 2500,
      minOrderValue: 20000,
      maxUses: 100,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  console.log('✅ VEXO Coupons initialized.');
  console.log('🎉 Database seeding for VEXO Systems complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
