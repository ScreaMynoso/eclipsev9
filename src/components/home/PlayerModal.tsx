import { X, Copy, Check, Target, Crosshair, Maximize2, Heart } from "lucide-react";
import { useState } from "react";
import type { Player } from "@/types/player";

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerModal = ({ player, onClose }: PlayerModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!player) return null;

  const handleCopy = (value: number, field: string) => {
    navigator.clipboard.writeText(value.toString());
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    // Here we would save to favorites in the database
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { icon: Target, label: "Sensi Geral", value: player.stats.sensiGeral, field: "geral" },
    { icon: Crosshair, label: "Red Dot", value: player.stats.redDot, field: "redDot" },
    { icon: Maximize2, label: "Mira 2x", value: player.stats.mira2x, field: "mira2x" },
    { icon: Maximize2, label: "Mira 4x", value: player.stats.mira4x, field: "mira4x" },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-24"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden animate-slide-up max-h-[75vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-24 bg-eclipse-radial flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/70 transition-colors"
          >
            <X size={18} className="text-foreground" />
          </button>
          
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="avatar-glow w-20 h-20">
              <img 
                src={player.image} 
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="pt-14 px-6 flex-1 overflow-y-auto">
          <h3 className="font-display text-xl font-bold text-foreground text-center mb-1">
            {player.name}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Configurações de Sensibilidade
          </p>

          <div className="space-y-3 pb-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const isCopied = copiedField === stat.field;
              
              return (
                <div 
                  key={stat.field}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                      <Icon size={16} className="text-foreground" />
                    </div>
                    <span className="text-sm text-foreground">{stat.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-foreground">
                      {stat.value}
                    </span>
                    <button
                      onClick={() => handleCopy(stat.value, stat.field)}
                      className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
                    >
                      {isCopied ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-border/50">
          <button 
            onClick={handleSave}
            className="btn-eclipse w-full font-display flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check size={18} className="text-green-400" />
                Salvo nos Favoritos!
              </>
            ) : (
              <>
                <Heart size={18} />
                Salvar nos Favoritos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
