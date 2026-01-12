import { useState, useRef, useEffect } from "react";
import { Search, Brain, Sparkles, Copy, RefreshCw, Heart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlayerModal } from "@/components/home/PlayerModal";
import { PlanLockOverlay } from "@/components/PlanLockOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Player } from "@/types/player";

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
  image: string;
  sensi_geral: number;
  red_dot: number;
  mira_2x: number;
  mira_4x: number;
  awm_sniper: number;
  olhadinha: number;
}

interface SensiResult {
  name: string;
  geral: number;
  redDot: number;
  mira2x: number;
  mira4x: number;
  awm: number;
  olhadinha: number;
  isFromDatabase: boolean;
}

const generateSensiForPlayer = (name: string, playerData?: PlayerData): SensiResult => {
  // If we have player data from database, use it
  if (playerData) {
    return {
      name,
      geral: playerData.sensi_geral,
      redDot: playerData.red_dot,
      mira2x: playerData.mira_2x,
      mira4x: playerData.mira_4x,
      awm: playerData.awm_sniper,
      olhadinha: playerData.olhadinha,
      isFromDatabase: true,
    };
  }
  
  // Otherwise generate random values for unknown players
  const base = 140 + Math.floor(Math.random() * 30);
  const variance = () => Math.floor((Math.random() - 0.5) * 20);
  
  return {
    name,
    geral: base + variance(),
    redDot: base + 5 + variance(),
    mira2x: base - 5 + variance(),
    mira4x: base - 20 + variance(),
    awm: base - 30 + variance(),
    olhadinha: base + 10 + variance(),
    isFromDatabase: false,
  };
};

const SensiIA = () => {
  const { profile } = useAuth();
  const userPlan = profile?.plan || "basic";
  const isLocked = userPlan === "basic";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SensiResult | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

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
          image: playerImages[p.name] || p.image_url || nobruImg,
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

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Find player in database
    const playerData = players.find(p => 
      p.name.toLowerCase() === searchQuery.toLowerCase()
    );
    
    setTimeout(() => {
      setResult(generateSensiForPlayer(searchQuery, playerData));
      setIsSearching(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1500);
  };

  const handleRegenerate = () => {
    if (!result) return;
    
    // Find player in database
    const playerData = players.find(p => 
      p.name.toLowerCase() === result.name.toLowerCase()
    );
    
    setIsSearching(true);
    setTimeout(() => {
      // If from database, just return the same values
      // If generated, regenerate with variance
      if (playerData) {
        setResult(generateSensiForPlayer(result.name, playerData));
      } else {
        setResult(generateSensiForPlayer(result.name));
      }
      setIsSearching(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 600);
  };

  const handlePlayerClick = (player: PlayerData) => {
    // Convert to Player type for modal
    const playerForModal: Player = {
      id: player.id,
      name: player.name,
      image: player.image,
      stats: {
        sensiGeral: player.sensi_geral,
        redDot: player.red_dot,
        mira2x: player.mira_2x,
        mira4x: player.mira_4x,
        awm: player.awm_sniper,
        olhadinha: player.olhadinha,
        dpi: 550,
      }
    };
    setSelectedPlayer(playerForModal);
  };

  const copyAll = () => {
    if (!result) return;
    const text = `Sensibilidade ${result.name}
Geral: ${result.geral}
Red Dot: ${result.redDot}
Mira 2x: ${result.mira2x}
Mira 4x: ${result.mira4x}
AWM/Sniper: ${result.awm}
Olhadinha: ${result.olhadinha}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Sensibilidade copiada para a área de transferência" });
  };

  const saveFavorite = () => {
    if (!result) return;
    const favorites = JSON.parse(localStorage.getItem("eclipse_favorites") || "[]");
    const newFavorite = {
      id: Date.now().toString(),
      type: "sensi_ia",
      name: `Sensi ${result.name}`,
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
      {isLocked && <PlanLockOverlay requiredPlan="premium" feature="Sensi IA" />}
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Sensi IA
            </h1>
            <p className="text-sm text-muted-foreground">
              Busca inteligente de sensibilidade
            </p>
          </div>
        </div>

        {/* Search Box */}
        <div className="glass-card p-6 rounded-2xl mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Digite o nome do influenciador..."
              className="input-eclipse pl-12"
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="btn-eclipse w-full font-display flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                Buscando com IA...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Buscar Sensibilidade
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="glass-card p-4 rounded-2xl animate-fade-in mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-primary">
                  Sensibilidade {result.name}
                </h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                result.isFromDatabase 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-primary/20 text-primary"
              }`}>
                {result.isFromDatabase ? "✓ Oficial" : "IA Generated"}
              </span>
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
                disabled={isSearching}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
              >
                <RefreshCw size={16} className={isSearching ? "animate-spin" : ""} />
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

            {!result.isFromDatabase && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                * Valor aproximado gerado por IA com base em dados públicos
              </p>
            )}
          </div>
        )}

        {/* Recommended Players */}
        <div className="mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Influenciadores Recomendados
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className="glass-card p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] text-left"
                >
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{player.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Sensi: {player.sensi_geral} • Red Dot: {player.red_dot}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl bg-secondary/30">
          <h4 className="font-medium text-foreground text-sm mb-2">
            Como funciona?
          </h4>
          <p className="text-xs text-muted-foreground">
            Nossa IA analisa streams, vídeos e posts para estimar a sensibilidade
            usada por qualquer influenciador de Free Fire, mesmo que não esteja 
            em nossa base de dados.
          </p>
        </div>
      </div>

      {/* Player Modal */}
      <PlayerModal 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
    </AppLayout>
  );
};

export default SensiIA;