import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PlayerModal } from "./PlayerModal";
import { supabase } from "@/integrations/supabase/client";
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

export const FamousPlayersCarousel = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("famous_players")
        .select("*")
        .eq("is_active", true)
        .order("name")
        .limit(6);
      
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
            dpi: 550,
          }
        }));
        setPlayers(mappedPlayers);
      }
      setIsLoading(false);
    };
    
    fetchPlayers();
  }, []);

  return (
    <>
      <section className="py-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Sensibilidade dos Famosos
          </h2>
          <Link 
            to="/famosos" 
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 pb-4 hide-scrollbar">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center gap-2 animate-pulse"
              >
                <div className="w-16 h-16 rounded-full bg-foreground/10" />
                <div className="w-12 h-3 rounded bg-foreground/10" />
              </div>
            ))
          ) : (
            players.map((player, index) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="flex-shrink-0 flex flex-col items-center gap-2 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="avatar-glow w-16 h-16">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-foreground font-medium max-w-16 truncate">
                  {player.name}
                </span>
              </button>
            ))
          )}
        </div>
      </section>

      <PlayerModal 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
    </>
  );
};