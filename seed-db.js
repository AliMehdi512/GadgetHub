import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { products, categories, users } from './shared/schema.js';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema: { products, categories, users } });

// Insert sample categories
const sampleCategories = [
  {
    id: crypto.randomUUID(),
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Accessories',
    slug: 'accessories',
    description: 'Tech accessories and peripherals',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Gaming',
    slug: 'gaming',
    description: 'Gaming equipment and accessories',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    createdAt: Date.now(),
  }
];

// Insert sample products
const sampleProducts = [
  {
    id: crypto.randomUUID(),
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: '199.99',
    categoryId: sampleCategories[0].id,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stockCount: 50,
    isDigital: 0,
    isFeatured: 1,
    isLimitedEdition: 0,
    viewCount: 0,
    averageRating: '4.5',
    reviewCount: 128,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Advanced smartwatch with health monitoring features',
    price: '399.99',
    categoryId: sampleCategories[0].id,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    stockCount: 25,
    isDigital: 0,
    isFeatured: 1,
    isLimitedEdition: 1,
    viewCount: 0,
    averageRating: '4.8',
    reviewCount: 89,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    description: 'RGB mechanical keyboard for gaming enthusiasts',
    price: '149.99',
    categoryId: sampleCategories[2].id,
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    stockCount: 75,
    isDigital: 0,
    isFeatured: 0,
    isLimitedEdition: 0,
    viewCount: 0,
    averageRating: '4.3',
    reviewCount: 67,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'USB-C Hub',
    slug: 'usb-c-hub',
    description: 'Multi-port USB-C hub for laptops and tablets',
    price: '79.99',
    categoryId: sampleCategories[1].id,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    stockCount: 100,
    isDigital: 0,
    isFeatured: 0,
    isLimitedEdition: 0,
    viewCount: 0,
    averageRating: '4.1',
    reviewCount: 45,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];

try {
  // Insert categories
  for (const category of sampleCategories) {
    db.insert(categories).values(category).run();
  }
  console.log('✅ Categories inserted successfully');

  // Insert products
  for (const product of sampleProducts) {
    db.insert(products).values(product).run();
  }
  console.log('✅ Products inserted successfully');

  console.log('🎉 Database seeded successfully!');
} catch (error) {
  console.error('❌ Error seeding database:', error);
} finally {
  sqlite.close();
}
