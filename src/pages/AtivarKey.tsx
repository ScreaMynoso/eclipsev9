import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Key, Sparkles, Check, AlertCircle, ArrowUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import eclipseLogo from "@/assets/eclipse-logo.png";

const AtivarKey = () => {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, activateKey, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      toast({
        title: "Erro",
        description: "Digite sua key de ativação",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await activateKey(key);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Key ativada!",
        description: "Sua conta foi ativada com sucesso. Aproveite o Eclipse V9!",
      });
      navigate("/");
    } else {
      toast({
        title: "Erro ao ativar",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const formatKey = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const parts = cleaned.match(/.{1,4}/g) || [];
    return parts.slice(0, 4).join("-");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  // If user has Black plan, show active status
  if (profile?.key_activated && profile.plan === "black") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center justify-between px-4 pt-6">
          <Link 
            to="/perfil"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <img src={eclipseLogo} alt="Eclipse V9" className="h-10 w-auto" />
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-purple-400" />
            </div>
            
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Plano Black Ativo
            </h1>
            <p className="text-muted-foreground mb-6">
              Você tem acesso a todos os recursos do Eclipse V9
            </p>
            
            <div className="glass-card p-4 rounded-2xl mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                BLACK
              </span>
              <p className="text-sm text-muted-foreground mt-3">
                Sua licença está ativa e funcionando
              </p>
            </div>

            <Link
              to="/"
              className="btn-eclipse w-full font-display inline-flex items-center justify-center gap-2"
            >
              Voltar ao App
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user has activated key but not Black, show upgrade option
  if (profile?.key_activated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center justify-between px-4 pt-6">
          <Link 
            to="/perfil"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <img src={eclipseLogo} alt="Eclipse V9" className="h-10 w-auto" />
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                <ArrowUp size={40} className="text-primary" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Atualizar Plano
              </h1>
              <p className="text-muted-foreground">
                Seu plano atual: <span className="font-bold text-primary uppercase">{profile.plan}</span>
              </p>
            </div>

            <form onSubmit={handleActivate} className="space-y-6">
              <div className="glass-card p-4 rounded-2xl">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Nova Key de Ativação
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(formatKey(e.target.value))}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="input-eclipse pl-11 uppercase tracking-widest font-mono"
                    maxLength={19}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || key.length < 19}
                className="btn-eclipse w-full font-display flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Sparkles size={18} className="animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <ArrowUp size={18} />
                    Atualizar Plano
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    Quer mais recursos?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Atualize para Premium ou Black e desbloqueie funcionalidades exclusivas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: User needs to activate key
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-4 pt-6">
        <Link 
          to="/auth"
          className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <img src={eclipseLogo} alt="Eclipse V9" className="h-10 w-auto" />
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Key size={40} className="text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Ativar Key
            </h1>
            <p className="text-muted-foreground">
              Digite sua key de ativação para liberar o acesso ao Eclipse V9
            </p>
          </div>

          <form onSubmit={handleActivate} className="space-y-6">
            <div className="glass-card p-4 rounded-2xl">
              <label className="text-sm text-muted-foreground mb-2 block">
                Key de Ativação
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(formatKey(e.target.value))}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="input-eclipse pl-11 uppercase tracking-widest font-mono"
                  maxLength={19}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || key.length < 19}
              className="btn-eclipse w-full font-display flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  Ativando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Ativar Key
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground text-sm mb-1">
                  Onde consigo uma key?
                </h4>
                <p className="text-xs text-muted-foreground">
                  As keys são vendidas através do nosso canal oficial. Entre em contato para adquirir a sua e desbloquear todos os recursos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtivarKey;
