import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Checkout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(false);

  // Mock cart items
  const cartItems = [
    {
      id: "1",
      name: "Premium Design Pack",
      price: 49.99,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    },
    {
      id: "2",
      name: "Icon Set Pro",
      price: 29.99,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Order Successful!",
        description: "Your digital products are now available for download.",
      });
      setProcessing(false);
      setLocation("/dashboard/downloads");
    }, 2000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItems.length} onCartClick={() => {}} />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold uppercase mb-12">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Payment Method */}
                <div className="bg-card border border-card-border rounded-md p-6">
                  <h2 className="text-xl font-heading font-bold uppercase mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div className="border border-border rounded-md p-4 bg-muted/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Secure payment powered by Stripe
                          </span>
                        </div>
                      </div>

                      {/* Stripe Elements would go here */}
                      <div className="bg-background rounded-md p-6 text-center text-muted-foreground">
                        <p className="mb-2">Stripe payment form will appear here</p>
                        <p className="text-sm">Add Stripe keys to enable payment processing</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full uppercase font-bold tracking-wide text-lg"
                  disabled={processing}
                  data-testid="button-place-order"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>Place Order ${total.toFixed(2)}</>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-card-border rounded-md p-6 sticky top-24">
                <h2 className="text-xl font-heading font-bold uppercase mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4" data-testid={`summary-item-${item.id}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold uppercase text-sm mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span data-testid="text-tax">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span data-testid="text-total">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Badge className="w-full justify-center py-2 mt-6 bg-accent text-accent-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="uppercase font-bold text-xs">Instant Digital Delivery</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </ProtectedRoute>
  );
}
