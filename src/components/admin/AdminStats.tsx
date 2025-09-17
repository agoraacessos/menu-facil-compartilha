import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tag, ShoppingCart, DollarSign } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';

export function AdminStats() {
  const { products } = useProducts();
  const { categories } = useCategories();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const activeProducts = products.filter(p => p.available).length;
  const promotionProducts = products.filter(p => p.is_promotion).length;

  const stats = [
    {
      title: 'Total de Produtos',
      value: totalProducts,
      icon: Package,
      description: `${activeProducts} ativos`
    },
    {
      title: 'Categorias',
      value: totalCategories,
      icon: Tag,
      description: 'Total de categorias'
    },
    {
      title: 'Promoções',
      value: promotionProducts,
      icon: DollarSign,
      description: 'Produtos em promoção'
    },
    {
      title: 'Produtos Inativos',
      value: totalProducts - activeProducts,
      icon: ShoppingCart,
      description: 'Produtos desativados'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}