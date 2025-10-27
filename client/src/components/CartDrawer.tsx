import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    slug: string;
  };
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        data-testid="backdrop-cart"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col" data-testid="drawer-cart">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-heading font-bold uppercase">
            Shopping Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={onClose} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-md border border-border"
                  data-testid={`cart-item-${item.id}`}
                >
                  <Link href={`/product/${item.product.slug}`}>
                    <a onClick={onClose}>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                        data-testid={`img-cart-${item.id}`}
                      />
                    </a>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`}>
                      <a onClick={onClose}>
                        <h3 className="font-heading font-semibold uppercase text-sm mb-1 truncate hover:text-accent" data-testid={`text-cart-name-${item.id}`}>
                          {item.product.name}
                        </h3>
                      </a>
                    </Link>
                    <p className="text-sm font-medium mb-2" data-testid={`text-cart-price-${item.id}`}>
                      ${Number(item.product.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onRemoveItem(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold uppercase">Subtotal</span>
              <span className="font-bold" data-testid="text-subtotal">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Badge className="w-full justify-center py-2 bg-accent text-accent-foreground" data-testid="badge-instant-delivery">
              <span className="uppercase font-bold text-xs">Instant Digital Delivery</span>
            </Badge>

            <Link href="/checkout">
              <a onClick={onClose} className="block">
                <Button className="w-full uppercase font-bold tracking-wide" size="lg" data-testid="button-checkout">
                  Checkout
                </Button>
              </a>
            </Link>

            <button
              onClick={onClose}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              data-testid="button-continue-shopping-footer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
