import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image, FileText, Trash2 } from 'lucide-react';

export function FileUploadManager() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<string>('products');

  const buckets = [
    { id: 'products', name: 'Produtos', icon: Image },
    { id: 'logos', name: 'Logos', icon: FileText },
    { id: 'banners', name: 'Banners', icon: Image }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um arquivo primeiro.",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .upload(fileName, selectedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(selectedBucket)
        .getPublicUrl(data.path);

      toast({
        title: "Upload realizado!",
        description: `Arquivo enviado com sucesso para ${selectedBucket}.`,
      });

      // Copy URL to clipboard
      navigator.clipboard.writeText(publicUrl);
      toast({
        title: "URL copiada!",
        description: "A URL do arquivo foi copiada para a área de transferência.",
      });

      setSelectedFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bucket de Destino</Label>
            <div className="grid grid-cols-3 gap-2">
              {buckets.map((bucket) => (
                <button
                  key={bucket.id}
                  type="button"
                  className={`p-3 rounded-md border text-sm flex items-center gap-2 ${
                    selectedBucket === bucket.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setSelectedBucket(bucket.id)}
                >
                  <bucket.icon className="h-4 w-4" />
                  {bucket.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-input">Selecionar Arquivo</Label>
            <Input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
            />
          </div>

          {selectedFile && (
            <div className="p-3 border rounded-md bg-accent">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full">
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Produtos:</strong> Use para imagens dos produtos do cardápio</p>
            <p>• <strong>Logos:</strong> Use para o logo da loja</p>
            <p>• <strong>Banners:</strong> Use para banners promocionais</p>
            <p>• Após o upload, a URL será copiada automaticamente</p>
            <p>• Use essas URLs nos formulários de produtos e configurações</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}