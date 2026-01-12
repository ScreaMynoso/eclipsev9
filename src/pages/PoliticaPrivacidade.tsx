import { ArrowLeft, Shield, Database, Eye, Lock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";

const PoliticaPrivacidade = () => {
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
            Política de Privacidade
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">Coleta de Dados</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Coletamos apenas as informações necessárias para fornecer nossos serviços:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Email para autenticação e comunicação
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Preferências de sensibilidade salvas
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Informações de licença e plano
              </li>
            </ul>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Eye size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">Uso das Informações</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Suas informações são utilizadas exclusivamente para:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Autenticar seu acesso ao aplicativo
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Sincronizar suas configurações entre dispositivos
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Enviar atualizações importantes sobre o serviço
              </li>
            </ul>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">Proteção de Dados</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Implementamos medidas de segurança robustas para proteger suas informações, incluindo 
              criptografia de ponta a ponta, armazenamento seguro em servidores protegidos e 
              acesso restrito apenas a pessoal autorizado.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">Seus Direitos</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. 
              Para exercer esses direitos, acesse a seção "Dados Pessoais" nas configurações de privacidade.
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-4">
            Última atualização: Janeiro de 2025
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default PoliticaPrivacidade;
