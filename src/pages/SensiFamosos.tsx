import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowLeft, Search, Sparkles, Copy, Heart, RefreshCw, Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Import player images as fallbacks
import nobruImg from "@/assets/players/nobru.png";
import fantasmaImg from "@/assets/players/fantasma.png";
import two9Img from "@/assets/players/two9.png";
import marechalImg from "@/assets/players/marechal.png";
import freitasImg from "@/assets/players/freitas.png";
import blackn444Img from "@/assets/players/blackn444.png";
import xauanImg from "@/assets/players/xauan.png";
import phzinImg from "@/assets/players/phzin.png";
import apelapatoImg from "@/assets/players/apelapato.png";
import mandelaImg from "@/assets/players/mandela.jpg";
import dantesImg from "@/assets/players/dantes.jpg";
import jotavImg from "@/assets/players/jotav.jpg";
import deusaImg from "@/assets/players/deusa.jpg";
import zullu771Img from "@/assets/players/zullu771.jpg";
import felpszImg from "@/assets/players/felpsz.jpg";

// Map player names to local images
const playerImages: Record<string, string> = {
  "Nobru": nobruImg,
  "Fantasma": fantasmaImg,
  "Two9": two9Img,
  "Marechal": marechalImg,
  "Freitas": freitasImg,
  "Blackn444": blackn444Img,
  "Xauan": xauanImg,
  "Phzin": phzinImg,
  "Apelapato": apelapatoImg,
  "Mandela": mandelaImg,
  "Dantes": dantesImg,
  "Jotav": jotavImg,
  "Deusa": deusaImg,
  "Zullu771": zullu771Img,
  "Felpsz": felpszImg,
};

interface PlayerData {
  id: string;
  name: string;
  image?: string;
  sensi_geral: number;
  red_dot: number;
  mira_2x: number;
  mira_4x: number;
  awm_sniper: number;
  olhadinha: number;
}

interface SensiResult {
  name: string;
  style: string;
  geral: number;
  redDot: number;
  mira2x: number;
  mira4x: number;
  awm: number;
  olhadinha: number;
  isGenerated: boolean;
}

const FREE_PLAYER_LIMIT = 5;

const styles = ["Original", "Balanceada", "Mais capa", "Mais controle", "Muito rápida"];

// Generate sensi based on original values with style adjustments
const generateSensi = (style: string, originalData?: PlayerData): Omit<SensiResult, "name" | "style" | "isGenerated"> => {
  // If we have original data and style is "Original", return exact values
  if (originalData && style === "Original") {
    return {
      geral: originalData.sensi_geral,
      redDot: originalData.red_dot,
      mira2x: originalData.mira_2x,
      mira4x: originalData.mira_4x,
      awm: originalData.awm_sniper,
      olhadinha: originalData.olhadinha,
    };
  }
  
  // Base values from original data or defaults
  const base = originalData ? {
    geral: originalData.sensi_geral,
    redDot: originalData.red_dot,
    mira2x: originalData.mira_2x,
    mira4x: originalData.mira_4x,
    awm: originalData.awm_sniper,
    olhadinha: originalData.olhadinha,
  } : {
    geral: 145,
    redDot: 150,
    mira2x: 140,
    mira4x: 125,
    awm: 115,
    olhadinha: 155,
  };
  
  const styleModifiers = {
    "Balanceada": { multiplier: 1.0, variance: 5 },
    "Mais capa": { multiplier: 1.1, variance: 8 },
    "Mais controle": { multiplier: 0.9, variance: 3 },
    "Muito rápida": { multiplier: 1.2, variance: 10 },
  };
  
  const config = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers["Balanceada"];
  const adjust = (value: number) => 
    Math.floor(value * config.multiplier + (Math.random() - 0.5) * config.variance * 2);

  return {
    geral: adjust(base.geral),
    redDot: adjust(base.redDot),
    mira2x: adjust(base.mira2x),
    mira4x: adjust(base.mira4x),
    awm: adjust(base.awm),
    olhadinha: adjust(base.olhadinha),
  };
};

const SensiFamosos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Original");
  const [result, setResult] = useState<SensiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const { profile } = useAuth();
  const userPlan = profile?.plan || "basic";
  const isBasicPlan = userPlan === "basic";

  // Fetch players from database
  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("famous_players")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (data && !error) {
        const mappedPlayers: PlayerData[] = data.map(p => ({
          id: p.id,
          name: p.name,
          image: playerImages[p.name] || p.image_url,
          sensi_geral: p.sensi_geral,
          red_dot: p.red_dot,
          mira_2x: p.mira_2x,
          mira_4x: p.mira_4x,
          awm_sniper: p.awm_sniper,
          olhadinha: p.olhadinha,
        }));
        setPlayers(mappedPlayers);
      }
      setIsLoading(false);
    };
    
    fetchPlayers();
  }, []);

  const suggestions = useMemo(() => {
    const allSuggestions = searchQuery 
      ? players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : players.slice(0, 12);
    return allSuggestions;
  }, [searchQuery, players]);
  
  // For basic plan, only first 5 players are accessible
  const accessiblePlayers = isBasicPlan ? players.slice(0, FREE_PLAYER_LIMIT) : players;

  const handleGenerate = async (playerName?: string) => {
    const name = playerName || searchQuery;
    if (!name.trim()) return;
    
    // Check if player is accessible for basic plan
    const playerIndex = players.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    const isPlayerAccessible = playerIndex !== -1 && (playerIndex < FREE_PLAYER_LIMIT || !isBasicPlan);
    
    if (isBasicPlan && !isPlayerAccessible && playerIndex >= FREE_PLAYER_LIMIT) {
      toast({ 
        title: "Jogador Bloqueado", 
        description: "Faça upgrade para Premium para acessar este jogador",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Find player data from database
    const playerData = players.find(p => p.name.toLowerCase() === name.toLowerCase());
    
    setTimeout(() => {
      const sensi = generateSensi(selectedStyle, playerData);
      setResult({
        name: name,
        style: selectedStyle,
        ...sensi,
        isGenerated: !playerData,
      });
      setIsGenerating(false);
      // Auto-scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 800);
  };

  const handleRegenerate = () => {
    if (result) {
      handleGenerate(result.name);
    }
  };

  const copyValue = (field: string, value: number) => {
    navigator.clipboard.writeText(value.toString());
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
    toast({ title: "Copiado!", description: `${field}: ${value}` });
  };

  const copyAll = () => {
    if (!result) return;
    const text = `Sensi: ${result.name}
Estilo: ${result.style}
Geral: ${result.geral}
Red Dot: ${result.redDot}
Mira 2x: ${result.mira2x}
Mira 4x: ${result.mira4x}
AWM/Sniper: ${result.awm}
Olhadinha: ${result.olhadinha}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Tudo copiado!", description: "Sensibilidade copiada para a área de transferência" });
  };

  const saveFavorite = () => {
    if (!result) return;
    const favorites = JSON.parse(localStorage.getItem("eclipse_favorites") || "[]");
    const newFavorite = {
      id: Date.now().toString(),
      type: "sensi_famoso",
      name: result.name,
      style: result.style,
      data: result,
      createdAt: new Date().toISOString(),
    };
    favorites.push(newFavorite);
    localStorage.setItem("eclipse_favorites", JSON.stringify(favorites));
    toast({ title: "Salvo!", description: "Adicionado aos favoritos" });
  };

  const sensiFields = result ? [
    { label: "Geral", value: result.geral },
    { label: "Red Dot", value: result.redDot },
    { label: "Mira 2x", value: result.mira2x },
    { label: "Mira 4x", value: result.mira4x },
    { label: "AWM / Sniper", value: result.awm },
    { label: "Olhadinha", value: result.olhadinha },
  ] : [];

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
              Sensi dos Famosos
            </h1>
            <p className="text-sm text-muted-foreground">
              Configurações inspiradas nos pros
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">Qual famoso?</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome..."
              className="input-eclipse pl-11"
            />
          </div>
        </div>

        {/* Quick Suggestions with Images */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-3 block">
            Sugestões rápidas: 
            {isBasicPlan && <span className="text-primary ml-1">(5 grátis)</span>}
          </label>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
          <div className="grid grid-cols-4 gap-3">
            {suggestions.filter(p => p.image).map((player, index) => {
              const playerIndex = players.findIndex(p => p.name === player.name);
              const isLocked = isBasicPlan && playerIndex >= FREE_PLAYER_LIMIT;
              
              return (
                <button
                  key={player.name}
                  onClick={() => {
                    if (isLocked) {
                      toast({ 
                        title: "Jogador Bloqueado", 
                        description: "Faça upgrade para Premium",
                        variant: "destructive"
                      });
                      return;
                    }
                    setSearchQuery(player.name);
                    handleGenerate(player.name);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all relative ${
                    isLocked 
                      ? "opacity-50"
                      : searchQuery.toLowerCase() === player.name.toLowerCase()
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "bg-foreground/5 hover:bg-foreground/10"
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={player.image} 
                      alt={player.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 border-primary/30 ${isLocked ? "grayscale" : ""}`}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
                        <Lock size={16} className="text-primary" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground text-center truncate w-full">
                    {player.name}
                  </span>
                </button>
              );
            })}
          </div>
          )}
          
          {/* Upgrade Banner */}
          {isBasicPlan && (
            <Link
              to="/ativar-key"
              className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 flex items-center gap-3 hover:from-primary/30 hover:to-primary/20 transition-all"
            >
              <Crown size={20} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Desbloqueie todos os jogadores</p>
                <p className="text-xs text-muted-foreground">Upgrade para Premium</p>
              </div>
            </Link>
          )}
        </div>

        {/* Style Selection */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-3 block">O que você quer priorizar?</label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStyle === style
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating || !searchQuery.trim()}
          className="btn-eclipse w-full font-display flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Sparkles size={18} className="animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Gerar Sensi
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="glass-card p-4 rounded-2xl animate-fade-in mb-4">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-primary">
                Sensi: {result.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Estilo: {result.style.toLowerCase()}
              </p>
            </div>

            <div className="space-y-0 border border-border/30 rounded-xl overflow-hidden">
              {sensiFields.map((field, index) => (
                <div
                  key={field.label}
                  className={`flex items-center justify-between p-3 ${
                    index % 2 === 0 ? "bg-foreground/5" : "bg-transparent"
                  }`}
                >
                  <span className="text-foreground">{field.label}</span>
                  <span className="text-primary font-bold text-lg">{field.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleRegenerate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm"
              >
                <RefreshCw size={16} />
                Gerar de novo
              </button>
              <button
                onClick={copyAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/10 text-foreground font-medium text-sm"
              >
                <Copy size={16} />
                Copiar tudo
              </button>
              <button
                onClick={saveFavorite}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/20 text-primary font-medium text-sm"
              >
                <Heart size={16} />
                Salvar
              </button>
            </div>

            {result.isGenerated && (
              <p className="text-xs text-center text-muted-foreground mt-4 p-3 bg-primary/10 rounded-lg">
                💡 Dica: Esta é uma sugestão gerada. Ajuste os valores conforme seu gosto e estilo de jogo.
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SensiFamosos;
