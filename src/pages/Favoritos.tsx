import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Trash2, Copy, Target, Smartphone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "@/hooks/use-toast";

interface Favorite {
  id: string;
  type: string;
  name: string;
  style?: string;
  weapon?: string;
  data: any;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  sensi_famoso: <Sparkles size={18} className="text-primary" />,
  sensi_aleatoria: <Sparkles size={18} className="text-primary" />,
  sensi_arma: <Target size={18} className="text-primary" />,
  dpi_android: <Smartphone size={18} className="text-primary" />,
  ciclos_iphone: <Smartphone size={18} className="text-primary" />,
};

const typeLabels: Record<string, string> = {
  sensi_famoso: "Sensi Famoso",
  sensi_aleatoria: "Sensi Aleatória",
  sensi_arma: "Sensi por Arma",
  dpi_android: "DPI Android",
  ciclos_iphone: "Ciclos iPhone",
};

const Favoritos = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem("eclipse_favorites") || "[]");
    setFavorites(saved.sort((a: Favorite, b: Favorite) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const deleteFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    localStorage.setItem("eclipse_favorites", JSON.stringify(updated));
    setFavorites(updated);
    toast({ title: "Removido!", description: "Item removido dos favoritos" });
  };

  const copyFavorite = (favorite: Favorite) => {
    let text = "";
    
    if (favorite.type.includes("sensi")) {
      const data = favorite.data;
      text = `${favorite.name}
Estilo: ${data.style || favorite.style}
Geral: ${data.geral}
Red Dot: ${data.redDot}
Mira 2x: ${data.mira2x}
Mira 4x: ${data.mira4x}
AWM/Sniper: ${data.awm}
Olhadinha: ${data.olhadinha}`;
    } else if (favorite.type === "dpi_android") {
      const data = favorite.data;
      text = `DPI Android
Marca: ${data.brand}
DPI: ${data.dpi}
Perfil: ${data.profile}
Objetivo: ${data.objective}`;
    } else if (favorite.type === "ciclos_iphone") {
      const data = favorite.data;
      const cyclesText = data.cycles.map((c: number, i: number) => `Ciclo ${i + 1}: ${c}`).join("\n");
      text = `Ciclos iPhone
Modelo: ${data.model}
Média: ${data.avgCycle}
${cyclesText}`;
    }
    
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Conteúdo copiado para a área de transferência" });
  };

  const filteredFavorites = filter === "all" 
    ? favorites 
    : favorites.filter(f => f.type === filter);

  const filterOptions = [
    { id: "all", label: "Todos" },
    { id: "sensi_famoso", label: "Famosos" },
    { id: "sensi_aleatoria", label: "Aleatória" },
    { id: "sensi_arma", label: "Armas" },
    { id: "dpi_android", label: "DPI" },
    { id: "ciclos_iphone", label: "Ciclos" },
  ];

  const renderFavoriteContent = (favorite: Favorite) => {
    const data = favorite.data;
    
    if (favorite.type.includes("sensi")) {
      return (
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center p-2 bg-foreground/5 rounded-lg">
            <p className="text-xs text-muted-foreground">Geral</p>
            <p className="font-bold text-primary">{data.geral}</p>
          </div>
          <div className="text-center p-2 bg-foreground/5 rounded-lg">
            <p className="text-xs text-muted-foreground">Red Dot</p>
            <p className="font-bold text-primary">{data.redDot}</p>
          </div>
          <div className="text-center p-2 bg-foreground/5 rounded-lg">
            <p className="text-xs text-muted-foreground">Mira 2x</p>
            <p className="font-bold text-primary">{data.mira2x}</p>
          </div>
        </div>
      );
    } else if (favorite.type === "dpi_android") {
      return (
        <div className="mt-3 p-3 bg-foreground/5 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">DPI Recomendado</p>
          <p className="font-bold text-2xl text-primary">{data.dpi}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.brand} • {data.profile}</p>
        </div>
      );
    } else if (favorite.type === "ciclos_iphone") {
      return (
        <div className="mt-3 p-3 bg-foreground/5 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">Média dos Ciclos</p>
          <p className="font-bold text-2xl text-primary">{data.avgCycle}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.model} • {data.preference}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link 
            to="/"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Favoritos
            </h1>
            <p className="text-sm text-muted-foreground">
              {favorites.length} itens salvos
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === option.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/10 text-foreground hover:bg-foreground/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Favorites List */}
        {filteredFavorites.length > 0 ? (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="glass-card p-4 rounded-2xl animate-fade-in"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      {typeIcons[favorite.type] || <Heart size={18} className="text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{favorite.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {typeLabels[favorite.type] || favorite.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyFavorite(favorite)}
                      className="p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                    >
                      <Copy size={16} className="text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteFavorite(favorite.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
                
                {renderFavoriteContent(favorite)}
                
                <p className="text-xs text-muted-foreground mt-3">
                  Salvo em {new Date(favorite.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Nenhum favorito
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all" 
                ? "Salve sensibilidades, DPIs e ciclos para acessar rapidamente."
                : `Nenhum item de "${filterOptions.find(f => f.id === filter)?.label}" salvo.`}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Favoritos;
