import { Home, Brain, Zap, User, Users, Crosshair, Smartphone, RefreshCw, Sparkles, Heart, ArrowRightLeft, Key, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import eclipseLogo from "@/assets/eclipse-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const mainNavItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/sensi-ia", icon: Brain, label: "Sensi IA" },
  { path: "/performance", icon: Zap, label: "Performance" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

const toolsNavItems = [
  { path: "/sensi-famosos", icon: Users, label: "Sensi dos Famosos" },
  { path: "/sensi-aleatoria", icon: Sparkles, label: "Gerar Sensi Aleatória" },
  { path: "/sensi-arma", icon: Crosshair, label: "Sensi por Arma" },
  { path: "/dpi-android", icon: Smartphone, label: "DPI Android" },
  { path: "/ciclos-iphone", icon: RefreshCw, label: "Ciclos iPhone" },
  { path: "/conversor-sensi", icon: ArrowRightLeft, label: "Conversor de Sensi" },
  { path: "/favoritos", icon: Heart, label: "Favoritos" },
];

const accountNavItems = [
  { path: "/ativar-key", icon: Key, label: "Ativar Key" },
  { path: "/configuracoes", icon: Settings, label: "Configurações" },
];

export const DesktopSidebar = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const getPlanBadge = () => {
    if (!profile?.plan) return null;
    const planLabels = {
      basic: { label: "Basic", className: "badge-basic" },
      premium: { label: "Premium", className: "badge-premium" },
      black: { label: "Black", className: "badge-black" },
    };
    const plan = planLabels[profile.plan];
    return plan ? <span className={plan.className}>{plan.label}</span> : null;
  };

  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-1 glass-card border-r border-border/50 rounded-none">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border/30">
          <img src={eclipseLogo} alt="Eclipse V9" className="w-10 h-10" />
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">ECLIPSE V9</h1>
            {getPlanBadge()}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto hide-scrollbar">
          {/* Principal */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Principal
            </h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-foreground" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ferramentas */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ferramentas
            </h3>
            <div className="space-y-1">
              {toolsNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Conta */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Conta
            </h3>
            <div className="space-y-1">
              {accountNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Eclipse V9 © 2025
          </p>
        </div>
      </div>
    </aside>
  );
};
