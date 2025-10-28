import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Package, Calendar, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);

  // Mock orders data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      total: 79.98,
      status: "completed",
      items: [
        {
          id: "1",
          name: "Premium Design Pack",
          price: 49.99,
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
          downloadUrl: "/downloads/premium-design-pack.zip",
        },
        {
          id: "2",
          name: "Icon Set Pro",
          price: 29.99,
          imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
          downloadUrl: "/downloads/icon-set-pro.zip",
        },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      total: 39.99,
      status: "completed",
      items: [
        {
          id: "3",
          name: "Typography Bundle",
          price: 39.99,
          imageUrl: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=400&q=80",
          downloadUrl: "/downloads/typography-bundle.zip",
        },
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      <Header cartItemCount={0} onCartClick={() => setCartOpen(true)} />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={[]}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold uppercase mb-2">
              My Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {user?.firstName || user?.email || "User"}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-orders">2</div>
                <p className="text-xs text-muted-foreground">All time purchases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-downloads">3</div>
                <p className="text-xs text-muted-foreground">Products owned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-spent">$119.97</div>
                <p className="text-xs text-muted-foreground">Lifetime value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-member-since">Jan 2024</div>
                <p className="text-xs text-muted-foreground">Account created</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
              <TabsTrigger value="downloads" data-testid="tab-downloads">Downloads</TabsTrigger>
              <TabsTrigger value="subscriptions" data-testid="tab-subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold uppercase">Order History</h2>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} data-testid={`order-${order.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-order-id-${order.id}`}>
                            {order.id}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2" data-testid={`badge-status-${order.id}`}>
                            {order.status}
                          </Badge>
                          <p className="text-lg font-bold" data-testid={`text-order-total-${order.id}`}>
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4" data-testid={`order-item-${item.id}`}>
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-heading font-semibold uppercase text-sm">
                                {item.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                            </div>
                            <Button size="sm" variant="outline" data-testid={`button-download-${item.id}`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold uppercase">My Downloads</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.flatMap(order => order.items).map((item) => (
                  <Card key={item.id} data-testid={`download-${item.id}`}>
                    <CardHeader className="p-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full aspect-square object-cover rounded-t-md"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-heading font-semibold uppercase text-sm mb-4">
                        {item.name}
                      </h3>
                      <Button className="w-full" size="sm" data-testid={`button-download-item-${item.id}`}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold uppercase">Subscriptions</h2>
              </div>

              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any active subscriptions</p>
                  <Button data-testid="button-browse-subscriptions">Browse Subscription Plans</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold uppercase">Account Settings</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground" data-testid="text-user-email">
                      {user?.email || "No email set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-muted-foreground" data-testid="text-user-name">
                      {user?.firstName || user?.lastName
                        ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                        : "No name set"}
                    </p>
                  </div>
                  <div className="pt-4">
                    <a href="/api/logout">
                      <Button variant="destructive" data-testid="button-logout">
                        Log Out
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      </div>
    </ProtectedRoute>
  );
}
