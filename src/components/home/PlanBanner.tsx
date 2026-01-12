import { Crown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanBannerProps {
  currentPlan: "basic" | "premium" | "black" | null;
}

export const PlanBanner = ({ currentPlan }: PlanBannerProps) => {
  const getPlanDetails = () => {
    switch (currentPlan) {
      case "black":
        return {
          title: "Plano Black Ativo",
          description: "Você tem acesso a todos os recursos do Eclipse V9",
          badge: "BLACK",
          gradient: "from-purple-500/20 to-purple-500/5",
          badgeClass: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        };
      case "premium":
        return {
          title: "Plano Premium Ativo",
          description: "Upgrade para Black e desbloqueie todos os recursos",
          badge: "PREMIUM",
          gradient: "from-primary/20 to-primary/5",
          badgeClass: "bg-primary/20 text-primary border border-primary/30",
        };
      case "basic":
        return {
          title: "Plano Basic Ativo",
          description: "Upgrade para Premium ou Black para mais recursos",
          badge: "BASIC",
          gradient: "from-foreground/20 to-foreground/5",
          badgeClass: "bg-foreground/10 text-muted-foreground border border-foreground/20",
        };
      default:
        return {
          title: "Ative sua License Key",
          description: "Desbloqueie todas as funcionalidades do Eclipse V9",
          badge: "ATIVAR",
          gradient: "from-foreground/10 to-transparent",
          badgeClass: "badge-black",
        };
    }
  };

  const details = getPlanDetails();

  return (
    <Link 
      to="/ativar-key" 
      className="mx-4 my-6 block"
    >
      <div className={`glass-card p-4 rounded-2xl bg-gradient-to-r ${details.gradient}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            currentPlan === "black" ? "bg-purple-500/20" : "bg-foreground/10"
          }`}>
            <Crown size={24} className={currentPlan === "black" ? "text-purple-400" : "text-foreground"} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-foreground">
                {details.title}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${details.badgeClass}`}>
                {details.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {details.description}
            </p>
          </div>
          
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
};
