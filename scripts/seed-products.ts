import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { products, categories } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Initialize database
const sqlite = new Database('./local.db');
const db = drizzle(sqlite, { schema: { products, categories } });

// Sample products with online images
const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 1199.99,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'
    ]),
    stockCount: 50,
    salesCount: 0,
    isDigital: false,
    isFeatured: true,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    description: 'Powerful laptop with M3 chip for professionals',
    price: 1999.99,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'
    ]),
    stockCount: 25,
    salesCount: 0,
    isDigital: false,
    isFeatured: true,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Premium noise-canceling headphones',
    price: 399.99,
    categoryId: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
    ]),
    stockCount: 100,
    salesCount: 0,
    isDigital: false,
    isFeatured: true,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Flagship Android smartphone with S Pen',
    price: 1299.99,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'
    ]),
    stockCount: 75,
    salesCount: 0,
    isDigital: false,
    isFeatured: true,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'iPad Pro 12.9"',
    slug: 'ipad-pro-12-9',
    description: 'Professional tablet with M2 chip',
    price: 1099.99,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'
    ]),
    stockCount: 40,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'AirPods Pro 2nd Gen',
    slug: 'airpods-pro-2nd-gen',
    description: 'Wireless earbuds with active noise cancellation',
    price: 249.99,
    categoryId: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80'
    ]),
    stockCount: 200,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    description: 'Gaming console with OLED display',
    price: 349.99,
    categoryId: 'gaming',
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80'
    ]),
    stockCount: 60,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'PlayStation 5',
    slug: 'playstation-5',
    description: 'Next-gen gaming console',
    price: 499.99,
    categoryId: 'gaming',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80'
    ]),
    stockCount: 30,
    salesCount: 0,
    isDigital: false,
    isFeatured: true,
    isLimitedEdition: true,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description: 'Advanced smartwatch with health monitoring',
    price: 399.99,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80'
    ]),
    stockCount: 80,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    description: 'Ultrabook with 13th gen Intel processor',
    price: 1299.99,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'
    ]),
    stockCount: 35,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Samsung 4K Monitor',
    slug: 'samsung-4k-monitor',
    description: '32-inch 4K UHD monitor for professionals',
    price: 599.99,
    categoryId: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
    ]),
    stockCount: 45,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Logitech MX Master 3S',
    slug: 'logitech-mx-master-3s',
    description: 'Wireless mouse for productivity',
    price: 99.99,
    categoryId: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80'
    ]),
    stockCount: 150,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 149.99,
    categoryId: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80'
    ]),
    stockCount: 90,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Webcam 4K',
    slug: 'webcam-4k',
    description: 'Professional 4K webcam for streaming',
    price: 199.99,
    categoryId: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&q=80'
    ]),
    stockCount: 70,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  },
  {
    name: 'Smart Speaker',
    slug: 'smart-speaker',
    description: 'Voice-controlled smart speaker with AI assistant',
    price: 79.99,
    categoryId: 'smart-home',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'
    ]),
    stockCount: 120,
    salesCount: 0,
    isDigital: false,
    isFeatured: false,
    isLimitedEdition: false,
    viewCount: 0,
    averageRating: 0,
    reviewCount: 0,
    isActive: true
  }
];

// Sample categories
const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780c723c765?w=500&q=80',
    isActive: true
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Tech accessories and peripherals',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    isActive: true
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Gaming equipment and accessories',
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80',
    isActive: true
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Smart home devices and automation',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    isActive: true
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Audio equipment and headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // First, create categories and get their IDs
    const categoryMap = new Map();
    
    for (const category of sampleCategories) {
      const [insertedCategory] = await db.insert(categories).values(category).returning();
      categoryMap.set(category.slug, insertedCategory.id);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Update products with correct category IDs
    const productsWithCategoryIds = sampleProducts.map(product => ({
      ...product,
      categoryId: categoryMap.get(product.categoryId) || null
    }));

    // Insert products
    for (const product of productsWithCategoryIds) {
      await db.insert(products).values(product);
      console.log(`✅ Created product: ${product.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${sampleCategories.length} categories and ${sampleProducts.length} products`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    sqlite.close();
  }
}

// Run the seeding
seedDatabase();
