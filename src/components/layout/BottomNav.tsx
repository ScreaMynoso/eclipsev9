import { Home, Brain, Zap, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/sensi-ia", icon: Brain, label: "Sensi IA" },
  { path: "/performance", icon: Zap, label: "Performance" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl border-t border-border/50">
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <div className="relative">
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-foreground/20 blur-xl" />
                )}
                <Icon 
                  size={24} 
                  className={`relative transition-all duration-300 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
