import { ArrowLeft, Shield, FileText, Lock, Eye } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Privacidade = () => {
  const privacyItems = [
    { 
      icon: FileText, 
      label: "Termos de Uso", 
      description: "Leia nossos termos de serviço",
      path: "/termos-uso"
    },
    { 
      icon: Shield, 
      label: "Política de Privacidade", 
      description: "Como protegemos seus dados",
      path: "/politica-privacidade"
    },
    { 
      icon: Lock, 
      label: "Segurança da Conta", 
      description: "Configurações de segurança",
      path: "/seguranca-conta"
    },
    { 
      icon: Eye, 
      label: "Dados Pessoais", 
      description: "Gerenciar seus dados",
      path: "/dados-pessoais"
    },
  ];

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/perfil"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-display text-xl font-bold text-foreground">
            Privacidade
          </h1>
        </div>

        {/* Privacy Items */}
        <div className="space-y-3">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className="w-full glass-card p-4 rounded-2xl flex items-center gap-4 neon-border text-left hover:bg-foreground/5 transition-colors"
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

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex gap-3">
            <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                Seus dados estão seguros
              </h4>
              <p className="text-xs text-muted-foreground">
                O Eclipse V9 utiliza criptografia de ponta para proteger todas as suas informações pessoais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Privacidade;
