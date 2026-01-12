import { Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanLockOverlayProps {
  requiredPlan: "premium" | "black";
  feature: string;
}

export const PlanLockOverlay = ({ requiredPlan, feature }: PlanLockOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="glass-card p-8 rounded-3xl max-w-sm w-full text-center animate-fade-in">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
          requiredPlan === "black" 
            ? "bg-purple-500/20" 
            : "bg-primary/20"
        }`}>
          <Lock size={40} className={requiredPlan === "black" ? "text-purple-400" : "text-primary"} />
        </div>
        
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Recurso Bloqueado
        </h2>
        
        <p className="text-muted-foreground mb-6">
          <span className="font-semibold text-foreground">{feature}</span> está disponível apenas para usuários do plano{" "}
          <span className={`font-bold ${requiredPlan === "black" ? "text-purple-400" : "text-primary"}`}>
            {requiredPlan.toUpperCase()}
          </span>
        </p>

        <Link
          to="/ativar-key"
          className={`btn-eclipse w-full flex items-center justify-center gap-2 ${
            requiredPlan === "black" 
              ? "bg-gradient-to-r from-purple-600 to-purple-400" 
              : ""
          }`}
        >
          <Crown size={18} />
          Fazer Upgrade
        </Link>

        <Link
          to="/"
          className="block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};
