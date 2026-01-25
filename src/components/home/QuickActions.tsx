import { Users, Crosshair, Smartphone, RefreshCw, Sparkles, Heart, ArrowRightLeft } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { 
    icon: Users, 
    label: "Sensi dos Famosos", 
    path: "/sensi-famosos",
    description: "Configurações inspiradas nos pros" 
  },
  { 
    icon: Sparkles, 
    label: "Gerar Sensi Aleatória", 
    path: "/sensi-aleatoria",
    description: "Crie sua sensi personalizada" 
  },
  { 
    icon: Crosshair, 
    label: "Sensibilidade por Arma", 
    path: "/sensi-arma",
    description: "Sensi focada na sua arma favorita" 
  },
  { 
    icon: Smartphone, 
    label: "DPI (Android)", 
    path: "/dpi-android",
    description: "Ajuste de DPI para Android" 
  },
  { 
    icon: RefreshCw, 
    label: "Ciclos (iPhone)", 
    path: "/ciclos-iphone",
    description: "Geração automática de ciclos" 
  },
  { 
    icon: ArrowRightLeft, 
    label: "Conversor de Sensi", 
    path: "/conversor-sensi",
    description: "Converta entre plataformas" 
  },
  { 
    icon: Heart, 
    label: "Favoritos", 
    path: "/favoritos",
    description: "Suas configurações salvas" 
  },
];

export const QuickActions = () => {
  return (
    <section className="px-4 py-6 lg:px-0">
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">
        Acesso Rápido
      </h2>
      
      {/* Mobile/Tablet: column layout | Desktop: grid layout */}
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="glass-card p-4 rounded-2xl neon-border group transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Icon size={22} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-base">
                    {action.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
