import { ArrowLeft, Lock, Smartphone, Key, Shield, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const SegurancaConta = () => {
  const { user } = useAuth();
  const [autenticacao2FA, setAutenticacao2FA] = useState(false);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/privacidade"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-display text-xl font-bold text-foreground">
            Segurança da Conta
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Account Info */}
          <div className="glass-card p-4 rounded-2xl">
            <h2 className="font-display font-semibold text-foreground mb-4">Informações da Conta</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm text-foreground">{user?.email || "Não informado"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Verificado</span>
              </div>
            </div>
          </div>

          {/* Security Options */}
          <div className="glass-card p-4 rounded-2xl">
            <h2 className="font-display font-semibold text-foreground mb-4">Opções de Segurança</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <Smartphone size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Autenticação 2FA</p>
                    <p className="text-xs text-muted-foreground">Segurança adicional</p>
                  </div>
                </div>
                <Switch checked={autenticacao2FA} onCheckedChange={setAutenticacao2FA} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <Key size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Alterar Senha</p>
                    <p className="text-xs text-muted-foreground">Atualizar credenciais</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium">Alterar</button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="glass-card p-4 rounded-2xl">
            <h2 className="font-display font-semibold text-foreground mb-4">Sessões Ativas</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-foreground/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Dispositivo Atual</p>
                    <p className="text-xs text-muted-foreground">Ativo agora</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-4 rounded-2xl border border-destructive/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-destructive" />
              <h2 className="font-display font-semibold text-foreground">Zona de Perigo</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ações irreversíveis. Prossiga com cuidado.
            </p>
            <button className="w-full p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
              Encerrar Todas as Sessões
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SegurancaConta;
