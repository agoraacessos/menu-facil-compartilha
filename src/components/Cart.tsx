import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/menu";
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from "lucide-react";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'kg': return 'kg';
      case '100g': return '100g';
      case '500g': return '500g';
      case 'litro': return 'L';
      case 'unidade': return 'un';
      default: return unit;
    }
  };

  if (items.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-12 h-12 object-cover rounded"
            />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.product.price)} / {getUnitLabel(item.product.unit)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.product.id)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
          
          <Button 
            onClick={onCheckout}
            className="w-full bg-gradient-secondary hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Finalizar Pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}