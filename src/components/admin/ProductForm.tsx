import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
}

export function ProductForm({ productId, onClose }: ProductFormProps) {
  const { products, createProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    unit: 'unidade' as 'kg' | '100g' | 'unidade' | 'litro' | '500g',
    available: true,
    is_promotion: false,
    image: ''
  });

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          original_price: product.original_price?.toString() || '',
          category_id: product.category_id || '',
          unit: product.unit,
          available: product.available,
          is_promotion: product.is_promotion,
          image: product.image || ''
        });
      }
    }
  }, [productId, products]);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category_id: formData.category_id || null,
        unit: formData.unit,
        available: formData.available,
        is_promotion: formData.is_promotion,
        image: imageUrl || null
      };

      if (productId) {
        await updateProduct(productId, productData);
        toast({
          title: "Produto atualizado!",
          description: "O produto foi atualizado com sucesso.",
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Produto criado!",
          description: "O produto foi adicionado ao cardápio.",
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{productId ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original_price">Preço Original</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                placeholder="Para produtos em promoção"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="100g">100g</SelectItem>
                  <SelectItem value="500g">500g</SelectItem>
                  <SelectItem value="litro">Litro</SelectItem>
                  <SelectItem value="unidade">Unidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">Disponível</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_promotion"
                checked={formData.is_promotion}
                onCheckedChange={(checked) => setFormData({ ...formData, is_promotion: checked })}
              />
              <Label htmlFor="is_promotion">Em Promoção</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}