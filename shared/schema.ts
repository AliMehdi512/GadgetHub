import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  uniqueIndex,
  pgTable,
  varchar,
  timestamp,
  decimal,
  boolean,
  text,
  integer,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for local auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for local auth
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  role: varchar("role", { length: 20 }).default("user").notNull(), // 'user' or 'admin'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
  cartItems: many(cartItems),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  imageUrl: text("image_url").notNull(),
  images: text("images").array(), // Array of image URLs
  stockCount: integer("stock_count").default(0).notNull(),
  salesCount: integer("sales_count").default(0).notNull(), // Track sales
  isDigital: boolean("is_digital").default(true).notNull(),
  downloadUrl: text("download_url"),
  licenseKey: text("license_key"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isLimitedEdition: boolean("is_limited_edition").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Cart Items table
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 255 }), // For unauthenticated users
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }), // For unauthenticated users
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(), // Order number for tracking
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address"), // JSON object
  billingAddress: jsonb("billing_address"), // JSON object
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  notes: text("notes"), // Admin notes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order Items table
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Reviews table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one review per user per product
  uniqUserProductReview: uniqueIndex("unique_user_product_review").on(table.productId, table.userId),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products);
export const insertCategorySchema = createInsertSchema(categories);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertReviewSchema = createInsertSchema(reviews);