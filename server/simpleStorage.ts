import { supabase } from "./db";

// Simple storage implementation using Supabase client directly
export class SimpleStorage {
  // User operations
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async upsertUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Product operations
  async getProducts(categoryId?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    // Map database fields to schema fields
    return (data || []).map(product => ({
      ...product,
      imageUrl: product.image_url,
      categoryId: product.category_id,
      stockCount: product.stock_count,
      salesCount: product.sales_count,
      isDigital: product.is_digital,
      downloadUrl: product.download_url,
      licenseKey: product.license_key,
      isFeatured: product.is_featured,
      isLimitedEdition: product.is_limited_edition,
      viewCount: product.view_count,
      averageRating: product.average_rating,
      reviewCount: product.review_count,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    
    // Map database fields to schema fields
    return {
      ...data,
      imageUrl: data.image_url,
      categoryId: data.category_id,
      stockCount: data.stock_count,
      salesCount: data.sales_count,
      isDigital: data.is_digital,
      downloadUrl: data.download_url,
      licenseKey: data.license_key,
      isFeatured: data.is_featured,
      isLimitedEdition: data.is_limited_edition,
      viewCount: data.view_count,
      averageRating: data.average_rating,
      reviewCount: data.review_count,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(4);
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  // Category operations
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw new Error(error.message);
    
    // Map database fields to schema fields
    return (data || []).map(category => ({
      ...category,
      imageUrl: category.image_url,
      isActive: category.is_active,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    }));
  }

  // Cart operations
  async getCartItems(userId: string | null, sessionId: string | null) {
    let query = supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `);
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else {
      return [];
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    
    // Map product fields in cart items
    return (data || []).map(item => ({
      ...item,
      product: item.product ? {
        ...item.product,
        imageUrl: item.product.image_url,
        categoryId: item.product.category_id,
        stockCount: item.product.stock_count,
        salesCount: item.product.sales_count,
        isDigital: item.product.is_digital,
        downloadUrl: item.product.download_url,
        licenseKey: item.product.license_key,
        isFeatured: item.product.is_featured,
        isLimitedEdition: item.product.is_limited_edition,
        viewCount: item.product.view_count,
        averageRating: item.product.average_rating,
        reviewCount: item.product.review_count,
        isActive: item.product.is_active,
        createdAt: item.product.created_at,
        updatedAt: item.product.updated_at,
      } : null
    }));
  }

  async addToCart(itemData: any) {
    const { data, error } = await supabase
      .from('cart_items')
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateCartItem(id: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async removeFromCart(id: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }

  async clearCart(userId: string | null, sessionId: string | null) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .or(`user_id.eq.${userId},session_id.eq.${sessionId}`);
    
    if (error) throw new Error(error.message);
  }

  // Order operations
  async createOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async createOrderItem(itemData: any) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async incrementProductSales(productId: string, quantity: number) {
    const { error } = await supabase.rpc('increment_sales', {
      product_id: productId,
      quantity: quantity
    });
    
    if (error) {
      // Fallback: manual update
      const { data: product } = await this.getProduct(productId);
      if (product) {
        await supabase
          .from('products')
          .update({ sales_count: (product.sales_count || 0) + quantity })
          .eq('id', productId);
      }
    }
  }

  // Admin operations
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProduct(productId: string, productData: any) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Stats
  async getUserCount() {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw new Error(error.message);
    return count || 0;
  }

  async getProductCount() {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw new Error(error.message);
    return count || 0;
  }

  async getOrderCount() {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw new Error(error.message);
    return count || 0;
  }

  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'delivered');
    
    if (error) throw new Error(error.message);
    return data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  }

  async getOrderCountByStatus(status: string) {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);
    
    if (error) throw new Error(error.message);
    return count || 0;
  }
}

export const storage = new SimpleStorage();
