import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryListProps {
  onEdit: (id: string) => void;
}

export function CategoryList({ onEdit }: CategoryListProps) {
  const { categories, deleteCategory } = useCategories();

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id);
        toast({
          title: "Categoria excluída!",
          description: "A categoria foi removida com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir a categoria.",
        });
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Emoji</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-2xl">{category.icon}</TableCell>
              <TableCell>
                <Badge className={category.color}>
                  Exemplo
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma categoria cadastrada.
        </div>
      )}
    </div>
  );
}