import { Layout, Clock } from "lucide-react";

export const HudGallery = () => {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <Layout size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Central de HUDs</h3>
          <p className="text-xs text-muted-foreground">Overlays para treino de posicionamento</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
          <Clock size={40} className="text-muted-foreground" />
        </div>
        <h4 className="font-display text-xl font-bold text-foreground mb-2">
          Em Breve
        </h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Estamos preparando overlays profissionais para treino de 2, 3 e 4 dedos. 
          Aguarde a próxima atualização!
        </p>
        <div className="mt-6 px-4 py-2 bg-foreground/5 rounded-full">
          <span className="text-xs text-muted-foreground">🚀 Lançamento previsto: Em breve</span>
        </div>
      </div>
    </div>
  );
};
