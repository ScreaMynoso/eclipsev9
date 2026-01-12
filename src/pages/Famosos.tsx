import { useState, useEffect } from "react";
import { ArrowLeft, Search, Star, Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlayerModal } from "@/components/home/PlayerModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Player } from "@/types/player";

// Import all player images as fallbacks
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

const FREE_PLAYER_LIMIT = 5;

const Famosos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const mappedPlayers: Player[] = data.map(p => ({
          id: p.id,
          name: p.name,
          image: playerImages[p.name] || p.image_url || nobruImg,
          stats: {
            sensiGeral: p.sensi_geral,
            redDot: p.red_dot,
            mira2x: p.mira_2x,
            mira4x: p.mira_4x,
            awm: p.awm_sniper,
            olhadinha: p.olhadinha,
            dpi: 550, // Default DPI value
          }
        }));
        setAllPlayers(mappedPlayers);
      }
      setIsLoading(false);
    };
    
    fetchPlayers();
  }, []);

  const filteredPlayers = allPlayers.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // For basic plan, only show first 5 players
  const visiblePlayers = isBasicPlan ? filteredPlayers.slice(0, FREE_PLAYER_LIMIT) : filteredPlayers;
  const lockedPlayers = isBasicPlan ? filteredPlayers.slice(FREE_PLAYER_LIMIT) : [];

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
              Famosos
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : `${allPlayers.length} jogadores profissionais`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar jogador..."
            className="input-eclipse pl-11"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Players Grid */}
        {!isLoading && <div className="grid grid-cols-3 gap-4">
          {visiblePlayers.map((player, index) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className="flex flex-col items-center gap-2 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                <div className="avatar-glow w-20 h-20">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                  <Star size={12} className="text-background" />
                </div>
              </div>
              <span className="text-sm text-foreground font-medium text-center truncate w-full">
                {player.name}
              </span>
            </button>
          ))}
          
          {/* Locked Players for Basic Plan */}
          {lockedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex flex-col items-center gap-2 animate-fade-in opacity-50"
              style={{ animationDelay: `${(visiblePlayers.length + index) * 50}ms` }}
            >
              <div className="relative">
                <div className="avatar-glow w-20 h-20 grayscale">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
                  <Lock size={24} className="text-primary" />
                </div>
              </div>
              <span className="text-sm text-muted-foreground font-medium text-center truncate w-full">
                {player.name}
              </span>
            </div>
          ))}
        </div>}

        {/* Upgrade Banner for Basic Users */}
        {isBasicPlan && lockedPlayers.length > 0 && (
          <Link
            to="/ativar-key"
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 flex items-center gap-4 hover:from-primary/30 hover:to-primary/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Crown size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">
                Desbloqueie todos os {allPlayers.length} jogadores
              </h3>
              <p className="text-sm text-muted-foreground">
                Faça upgrade para Premium e acesse todas as sensibilidades
              </p>
            </div>
          </Link>
        )}

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum jogador encontrado
            </p>
          </div>
        )}
      </div>

      <PlayerModal 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
    </AppLayout>
  );
};

export default Famosos;
