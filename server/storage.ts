import {
  users,
  products,
  categories,
  orders,
  orderItems,
  cartItems,
  reviews,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for local auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createLocalUser(userData: { email: string; firstName: string; lastName: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  incrementProductView(id: string): Promise<void>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Cart operations
  getCartItems(userId: string | null, sessionId: string | null): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string | null, sessionId: string | null): Promise<void>;

  // Order operations
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Review operations
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateProductRating(productId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createLocalUser(userData: { email: string; firstName: string; lastName: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async incrementProductView(id: string): Promise<void> {
    await db
      .update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, id));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    return category;
  }

  // Cart operations
  async getCartItems(userId: string | null, sessionId: string | null): Promise<CartItem[]> {
    if (userId) {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
    return [];
  }

  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItems = cartItemData.userId
      ? await db.select().from(cartItems).where(
          and(
            eq(cartItems.userId, cartItemData.userId),
            eq(cartItems.productId, cartItemData.productId)
          )
        )
      : cartItemData.sessionId
      ? await db.select().from(cartItems).where(
          and(
            eq(cartItems.sessionId, cartItemData.sessionId),
            eq(cartItems.productId, cartItemData.productId)
          )
        )
      : [];

    if (existingItems.length > 0) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({
          quantity: sql`${cartItems.quantity} + ${cartItemData.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItems[0].id))
        .returning();
      return updatedItem;
    }

    const [cartItem] = await db
      .insert(cartItems)
      .values(cartItemData)
      .returning();
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string | null, sessionId: string | null): Promise<void> {
    if (userId) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db
      .insert(orderItems)
      .values(orderItemData)
      .returning();
    return orderItem;
  }

  // Review operations
  async getProductReviews(productId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();

    // Update product rating
    await this.updateProductRating(reviewData.productId);

    return review;
  }

  async updateProductRating(productId: string): Promise<void> {
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId));

    if (productReviews.length > 0) {
      const avgRating =
        productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

      await db
        .update(products)
        .set({
          averageRating: avgRating.toFixed(2),
          reviewCount: productReviews.length,
        })
        .where(eq(products.id, productId));
    }
  }

  // Admin methods
  async getUserCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result[0]?.count || 0;
  }

  async getProductCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(products);
    return result[0]?.count || 0;
  }

  async getOrderCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(orders);
    return result[0]?.count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({ total: sql<number>`sum(total_amount)` })
      .from(orders)
      .where(eq(orders.status, 'delivered'));
    return result[0]?.total || 0;
  }

  async getOrderCountByStatus(status: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, status));
    return result[0]?.count || 0;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();
    return updatedProduct;
  }

  async incrementProductSales(productId: string, quantity: number): Promise<void> {
    await db
      .update(products)
      .set({ 
        salesCount: sql`${products.salesCount} + ${quantity}`,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId));
  }
}

export const storage = new DatabaseStorage();
