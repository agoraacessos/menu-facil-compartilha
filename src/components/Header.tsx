import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings, FileImage } from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenAdmin: () => void;
  onGenerateMenu: () => void;
}

export function Header({ searchTerm, onSearchChange, onOpenAdmin, onGenerateMenu }: HeaderProps) {
  return (
    <header className="bg-gradient-primary text-primary-foreground shadow-glow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🛒 Cardápio Digital</h1>
            <p className="text-primary-foreground/80">
              Produtos frescos e de qualidade para você
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateMenu}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <FileImage className="h-4 w-4 mr-2" />
              Gerar Cardápio
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAdmin}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/90 backdrop-blur-sm border-primary-foreground/20"
          />
        </div>
      </div>
    </header>
  );
}