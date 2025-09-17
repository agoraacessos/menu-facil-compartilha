import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/menu";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  cartQuantity?: number;
}

export function ProductCard({ product, onAddToCart, cartQuantity = 0 }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getUnitLabel = (unit: Product['unit']) => {
    switch (unit) {
      case 'kg': return 'kg';
      case '100g': return '100g';
      case '500g': return '500g';
      case 'litro': return 'L';
      case 'unidade': return 'un';
      default: return unit;
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in">
      {product.isPromotion && (
        <Badge className="absolute top-2 left-2 z-10 bg-gradient-accent text-accent-foreground">
          Promoção
        </Badge>
      )}
      
      {!product.available && (
        <div className="absolute inset-0 bg-muted/80 z-20 flex items-center justify-center">
          <Badge variant="secondary" className="text-lg">
            Indisponível
          </Badge>
        </div>
      )}

      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {getUnitLabel(product.unit)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {product.available && (
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          )}

          {cartQuantity > 0 && (
            <Badge variant="secondary" className="w-full justify-center">
              {cartQuantity} no carrinho
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}