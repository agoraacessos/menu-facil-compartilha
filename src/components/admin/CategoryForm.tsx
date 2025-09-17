import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface CategoryFormProps {
  categoryId?: string | null;
  onClose: () => void;
}

const colorOptions = [
  'bg-green-100 text-green-800',
  'bg-emerald-100 text-emerald-800',
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-orange-100 text-orange-800'
];

export function CategoryForm({ categoryId, onClose }: CategoryFormProps) {
  const { categories, createCategory, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: 'bg-green-100 text-green-800'
  });

  useEffect(() => {
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setFormData({
          name: category.name,
          icon: category.icon,
          color: category.color
        });
      }
    }
  }, [categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (categoryId) {
        await updateCategory(categoryId, formData);
        toast({
          title: "Categoria atualizada!",
          description: "A categoria foi atualizada com sucesso.",
        });
      } else {
        await createCategory(formData);
        toast({
          title: "Categoria criada!",
          description: "A categoria foi adicionada com sucesso.",
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar a categoria.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{categoryId ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="icon">Emoji</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              maxLength={2}
              placeholder="Ex: 🍎"
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`p-2 rounded text-sm ${color} ${
                    formData.color === color ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, color })}
                >
                  Sample
                </button>
              ))}
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