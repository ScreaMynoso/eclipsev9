import { ArrowLeft, FileText } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";

const TermosUso = () => {
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
            Termos de Uso
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">1. Aceitação dos Termos</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao acessar e usar o Eclipse V9, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não poderá acessar o aplicativo.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">2. Uso do Serviço</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Eclipse V9 fornece ferramentas para otimização de sensibilidade em jogos. 
              Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
              É proibido usar o aplicativo para qualquer atividade ilegal ou não autorizada.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">3. Licença de Uso</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao ativar uma License Key, você recebe uma licença limitada, não exclusiva e intransferível 
              para usar o Eclipse V9. Esta licença é válida pelo período especificado no momento da compra.
              A revenda ou compartilhamento de keys é estritamente proibido.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">4. Limitação de Responsabilidade</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Eclipse V9 é fornecido "como está". Não garantimos que o serviço será ininterrupto ou livre de erros. 
              Não nos responsabilizamos por quaisquer danos diretos, indiretos ou consequentes 
              resultantes do uso do aplicativo.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-primary" />
              <h2 className="font-display font-semibold text-foreground">5. Modificações</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Alterações significativas serão notificadas através do aplicativo. 
              O uso contínuo após as alterações constitui aceitação dos novos termos.
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

export default TermosUso;
