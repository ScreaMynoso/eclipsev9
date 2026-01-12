import { User, Key, Settings, Shield, ChevronRight, Crown, LogOut } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Perfil = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Até logo!", description: "Você saiu da sua conta" });
    navigate("/auth");
  };

  const getPlanLabel = () => {
    if (!profile?.key_activated) return null;
    return profile.plan?.toUpperCase() || "BASIC";
  };

  const menuItems = [
    { icon: Settings, label: "Configurações", description: "Preferências do app", path: "/configuracoes" },
    { 
      icon: Key, 
      label: "Minha Licença Key", 
      description: profile?.key_activated 
        ? `Plano ${profile.plan?.toUpperCase()} ativo` 
        : "Ativar sua licença", 
      path: "/ativar-key" 
    },
    { icon: Shield, label: "Privacidade", description: "Termos e políticas", path: "/privacidade" },
  ];

  return (
    <AppLayout>
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-foreground/10 mx-auto mb-4 flex items-center justify-center eclipse-glow">
            <User size={40} className="text-foreground" />
          </div>
          
          <h1 className="font-display text-xl font-bold text-foreground mb-1">
            {profile?.display_name || "Usuário"}
          </h1>
          <p className="text-sm text-muted-foreground mb-3">
            {user?.email}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            {profile?.key_activated && profile.plan && (
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                profile.plan === "black" 
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                  : profile.plan === "premium" 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "bg-foreground/10 text-muted-foreground border border-foreground/20"
              }`}>
                {profile.plan}
              </span>
            )}

            {isAdmin && (
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Admin Panel Link */}
        {isAdmin && (
          <Link
            to="/admin"
            className="glass-card p-4 rounded-2xl flex items-center gap-4 neon-border mb-4 bg-primary/10"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Crown size={20} className="text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm">Painel Admin</h3>
              <p className="text-xs text-muted-foreground">Gerenciar jogadores e keys</p>
            </div>
            
            <ChevronRight size={18} className="text-primary" />
          </Link>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className="glass-card p-4 rounded-2xl flex items-center gap-4 neon-border"
              >
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <Icon size={20} className="text-foreground" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full mt-6 p-4 rounded-2xl bg-destructive/10 flex items-center justify-center gap-2 text-destructive transition-colors hover:bg-destructive/20"
        >
          <LogOut size={18} />
          <span className="font-medium">Sair da Conta</span>
        </button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Eclipse V9 • Versão 9.0.0
        </p>
      </div>
    </AppLayout>
  );
};

export default Perfil;
