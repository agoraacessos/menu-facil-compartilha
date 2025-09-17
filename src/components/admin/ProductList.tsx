import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Search } from 'lucide-react';

interface ProductListProps {
  onEdit: (id: string) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
  const { products, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        toast({
          title: "Produto excluído!",
          description: "O produto foi removido do cardápio.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir o produto.",
        });
      }
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : '-';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground">
                          {product.description.substring(0, 50)}...
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryName(product.category_id)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.original_price && (
                      <span className="line-through text-muted-foreground text-sm">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                    <span className={product.is_promotion ? 'text-red-600 font-bold' : ''}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={product.available ? 'default' : 'secondary'}>
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </Badge>
                    {product.is_promotion && (
                      <Badge variant="destructive">Promoção</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {search ? 'Nenhum produto encontrado para a busca.' : 'Nenhum produto cadastrado.'}
        </div>
      )}
    </div>
  );
}