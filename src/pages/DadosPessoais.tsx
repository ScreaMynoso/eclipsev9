import { ArrowLeft, User, Mail, Calendar, Download, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const DadosPessoais = () => {
  const { user, profile } = useAuth();

  const handleExportData = () => {
    toast({
      title: "Exportando dados",
      description: "Seus dados serão enviados para seu email em breve.",
    });
  };

  const handleDeleteRequest = () => {
    toast({
      title: "Solicitação enviada",
      description: "Entraremos em contato para confirmar a exclusão.",
      variant: "destructive",
    });
  };

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
            Dados Pessoais
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Personal Data */}
          <div className="glass-card p-4 rounded-2xl">
            <h2 className="font-display font-semibold text-foreground mb-4">Seus Dados</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-foreground/5 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <User size={18} className="text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Nome de Exibição</p>
                  <p className="text-sm font-medium text-foreground">{profile?.display_name || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-foreground/5 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <Mail size={18} className="text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{user?.email || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-foreground/5 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <Calendar size={18} className="text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Membro desde</p>
                  <p className="text-sm font-medium text-foreground">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('pt-BR', { 
                          month: 'long', 
                          year: 'numeric' 
                        })
                      : "Data não disponível"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Actions */}
          <div className="glass-card p-4 rounded-2xl">
            <h2 className="font-display font-semibold text-foreground mb-4">Gerenciar Dados</h2>
            <div className="space-y-3">
              <button 
                onClick={handleExportData}
                className="w-full flex items-center gap-4 p-4 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Download size={18} className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Exportar Meus Dados</p>
                  <p className="text-xs text-muted-foreground">Baixe uma cópia de todas as suas informações</p>
                </div>
              </button>

              <button 
                onClick={handleDeleteRequest}
                className="w-full flex items-center gap-4 p-4 bg-destructive/5 rounded-xl hover:bg-destructive/10 transition-colors border border-destructive/20"
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <Trash2 size={18} className="text-destructive" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-destructive">Solicitar Exclusão de Dados</p>
                  <p className="text-xs text-muted-foreground">Remover permanentemente sua conta e dados</p>
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              De acordo com a LGPD, você tem direito de acessar, corrigir e excluir seus dados pessoais. 
              Solicitações de exclusão são processadas em até 15 dias úteis.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DadosPessoais;
