const { PrismaClient, Decimal } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal clear sound quality. Perfect for music lovers and professionals.",
    price: new Decimal(129.99),
    salePrice: new Decimal(99.99),
    stock: 50,
    category: "Electronics",
    tags: ["wireless", "bluetooth", "noise-cancellation", "music"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Compatible with iOS and Android.",
    price: new Decimal(199.99),
    salePrice: new Decimal(149.99),
    stock: 30,
    category: "Electronics",
    tags: ["fitness", "smartwatch", "health", "tracking"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500"
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: new Decimal(29.99),
    salePrice: new Decimal(24.99),
    stock: 100,
    category: "Clothing",
    tags: ["organic", "cotton", "sustainable", "comfortable"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    isActive: true,
    isFeatured: false
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Eco-friendly stainless steel water bottle with double-wall insulation. Keeps drinks cold for 24 hours or hot for 12 hours.",
    price: new Decimal(24.99),
    salePrice: new Decimal(19.99),
    stock: 75,
    category: "Home & Garden",
    tags: ["eco-friendly", "insulated", "stainless-steel", "water"],
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500"
    ],
    isActive: true,
    isFeatured: false
  },
  {
    name: "Professional Camera Lens",
    description: "High-quality 50mm f/1.8 prime lens for professional photography. Perfect for portraits, street photography, and low-light situations.",
    price: new Decimal(399.99),
    salePrice: new Decimal(349.99),
    stock: 15,
    category: "Electronics",
    tags: ["camera", "lens", "photography", "professional"],
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
      "https://images.unsplash.com/photo-1510127034890-ba27561e9a25?w=500"
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Handcrafted Wooden Desk",
    description: "Beautiful handcrafted wooden desk made from sustainable materials. Perfect for home office or study room.",
    price: new Decimal(299.99),
    salePrice: new Decimal(249.99),
    stock: 10,
    category: "Furniture",
    tags: ["handcrafted", "wooden", "desk", "sustainable"],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500"
    ],
    isActive: true,
    isFeatured: false
  },
  {
    name: "Natural Face Moisturizer",
    description: "Hydrating face moisturizer made with natural ingredients like aloe vera, jojoba oil, and vitamin E. Suitable for all skin types.",
    price: new Decimal(34.99),
    salePrice: new Decimal(29.99),
    stock: 60,
    category: "Beauty & Health",
    tags: ["natural", "moisturizer", "skincare", "hydrating"],
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500"
    ],
    isActive: true,
    isFeatured: false
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact and powerful portable speaker with 360-degree sound, waterproof design, and 20-hour battery life.",
    price: new Decimal(79.99),
    salePrice: new Decimal(59.99),
    stock: 40,
    category: "Electronics",
    tags: ["portable", "bluetooth", "speaker", "waterproof"],
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500"
    ],
    isActive: true,
    isFeatured: false
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@mybestshop.com' },
      update: {},
      create: {
        email: 'admin@mybestshop.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create sample products
    for (const productData of sampleProducts) {
      const product = await prisma.product.upsert({
        where: { name: productData.name },
        update: {},
        create: productData
      });
      console.log(`✅ Product created: ${product.name}`);
    }

    // Create sample regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@mybestshop.com' },
      update: {},
      create: {
        email: 'user@mybestshop.com',
        password: userPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        isActive: true
      }
    });

    console.log('✅ Regular user created:', regularUser.email);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@mybestshop.com / admin123');
    console.log('User: user@mybestshop.com / user123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
