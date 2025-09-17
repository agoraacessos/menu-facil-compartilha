import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStoreSettings } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function StoreSettingsForm() {
  const { settings, updateSettings } = useStoreSettings();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    store_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    facebook: '',
    address: '',
    delivery_fee: '',
    minimum_order: '',
    opening_hours: {
      segunda: '',
      terca: '',
      quarta: '',
      quinta: '',
      sexta: '',
      sabado: '',
      domingo: ''
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        address: settings.address || '',
        delivery_fee: settings.delivery_fee?.toString() || '',
        minimum_order: settings.minimum_order?.toString() || '',
        opening_hours: {
          segunda: settings.opening_hours?.segunda || '',
          terca: settings.opening_hours?.terca || '',
          quarta: settings.opening_hours?.quarta || '',
          quinta: settings.opening_hours?.quinta || '',
          sexta: settings.opening_hours?.sexta || '',
          sabado: settings.opening_hours?.sabado || '',
          domingo: settings.opening_hours?.domingo || ''
        }
      });
    }
  }, [settings]);

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData: any = {
        store_name: formData.store_name,
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        email: formData.email || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        address: formData.address || null,
        delivery_fee: formData.delivery_fee ? parseFloat(formData.delivery_fee) : 0,
        minimum_order: formData.minimum_order ? parseFloat(formData.minimum_order) : 0,
        opening_hours: formData.opening_hours
      };

      if (logoFile) {
        updatedData.logo_url = await uploadFile(logoFile, 'logos');
      }

      if (bannerFile) {
        updatedData.banner_url = await uploadFile(bannerFile, 'banners');
      }

      await updateSettings(updatedData);
      
      toast({
        title: "Configurações salvas!",
        description: "As configurações da loja foram atualizadas.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOpeningHours = (day: string, value: string) => {
    setFormData({
      ...formData,
      opening_hours: {
        ...formData.opening_hours,
        [day]: value
      }
    });
  };

  const days = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store_name">Nome da Loja *</Label>
              <Input
                id="store_name"
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="5511999999999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociais */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@meuinsta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="facebook.com/minhapagina"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horário de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle>Horário de Funcionamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {days.map((day) => (
              <div key={day.key} className="space-y-2">
                <Label htmlFor={day.key}>{day.label}</Label>
                <Input
                  id={day.key}
                  value={formData.opening_hours[day.key as keyof typeof formData.opening_hours]}
                  onChange={(e) => updateOpeningHours(day.key, e.target.value)}
                  placeholder="08:00-18:00 ou 'fechado'"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_fee">Taxa de Entrega (R$)</Label>
              <Input
                id="delivery_fee"
                type="number"
                step="0.01"
                value={formData.delivery_fee}
                onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum_order">Pedido Mínimo (R$)</Label>
              <Input
                id="minimum_order"
                type="number"
                step="0.01"
                value={formData.minimum_order}
                onChange={(e) => setFormData({ ...formData, minimum_order: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo da Loja</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              {settings?.logo_url && (
                <img src={settings.logo_url} alt="Logo atual" className="w-20 h-20 object-contain" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner da Loja</Label>
              <Input
                id="banner"
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              />
              {settings?.banner_url && (
                <img src={settings.banner_url} alt="Banner atual" className="w-32 h-20 object-cover" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </form>
  );
}