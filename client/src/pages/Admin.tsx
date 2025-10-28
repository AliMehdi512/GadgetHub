import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import type { Product, Category, Order, User } from "@shared/schema";

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
}

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("all");
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, user, isLoading, toast, setLocation]);

  // Fetch admin data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        apiRequest("/api/admin/stats"),
        apiRequest("/api/admin/products"),
        apiRequest("/api/admin/orders"),
        apiRequest("/api/admin/users")
      ]);
      
      setStats(statsRes);
      setProducts(productsRes);
      setOrders(ordersRes);
      setUsers(usersRes);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiRequest(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleProductUpdate = async (product: Product) => {
    try {
      await apiRequest(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      });
      
      setProducts(products.map(p => p.id === product.id ? product : p));
      setIsEditingProduct(false);
      setEditingProduct(null);
      
      toast({
        title: "Product Updated",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedOrderStatus === "all" || order.status === selectedOrderStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-background">
      <Header cartItemCount={0} onCartClick={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold uppercase mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your GadgetHub store</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Manage and track customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={selectedOrderStatus} onValueChange={setSelectedOrderStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{order.userId}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'processing' ? 'secondary' :
                              order.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusUpdate(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Management</CardTitle>
                      <CardDescription>Manage your product catalog</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.imageUrl || "/placeholder-product.png"}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.slug}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stockCount}</TableCell>
                          <TableCell>{product.salesCount}</TableCell>
                          <TableCell>
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsEditingProduct(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "destructive"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pending</span>
                        <span>{stats?.pendingOrders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing</span>
                        <span>{stats?.processingOrders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivered</span>
                        <span>{stats?.deliveredOrders || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {products
                        .sort((a, b) => b.salesCount - a.salesCount)
                        .slice(0, 5)
                        .map((product) => (
                          <div key={product.id} className="flex justify-between">
                            <span className="truncate">{product.name}</span>
                            <span>{product.salesCount} sales</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
      </div>
    </ProtectedRoute>
  );
}
