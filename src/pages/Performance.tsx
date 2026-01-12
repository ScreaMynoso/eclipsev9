import { useState } from "react";
import { Zap, Crosshair, Calculator, FileCode, Wifi, Layout, Settings } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TouchCalibrator } from "@/components/performance/TouchCalibrator";
import { DpiConverter } from "@/components/performance/DpiConverter";
import { MacroConfigGenerator } from "@/components/performance/MacroConfigGenerator";
import { NetworkMonitor } from "@/components/performance/NetworkMonitor";
import { HudGallery } from "@/components/performance/HudGallery";
import { OptimizationChecklist } from "@/components/performance/OptimizationChecklist";
import { useAuth } from "@/contexts/AuthContext";

type TabId = "calibrator" | "dpi" | "config" | "network" | "hud" | "checklist";

interface Tab {
  id: TabId;
  icon: typeof Zap;
  label: string;
  shortLabel: string;
}

const tabs: Tab[] = [
  { id: "calibrator", icon: Crosshair, label: "Calibrador de Tela", shortLabel: "Calibrar" },
  { id: "dpi", icon: Calculator, label: "Conversor DPI", shortLabel: "DPI" },
  { id: "network", icon: Wifi, label: "Monitor de Rede", shortLabel: "Rede" },
  { id: "config", icon: FileCode, label: "Gerador Config", shortLabel: "Config" },
  { id: "hud", icon: Layout, label: "Central de HUDs", shortLabel: "HUDs" },
  { id: "checklist", icon: Settings, label: "Checklist de Ouro", shortLabel: "Otimizar" },
];

const Performance = () => {
  const [activeTab, setActiveTab] = useState<TabId>("calibrator");
  const { profile } = useAuth();
  const userPlan = profile?.plan || null;

  const renderContent = () => {
    switch (activeTab) {
      case "calibrator":
        return <TouchCalibrator />;
      case "dpi":
        return <DpiConverter />;
      case "config":
        return <MacroConfigGenerator userPlan={userPlan} />;
      case "network":
        return <NetworkMonitor />;
      case "hud":
        return <HudGallery />;
      case "checklist":
        return <OptimizationChecklist />;
      default:
        return <TouchCalibrator />;
    }
  };

  return (
    <AppLayout>
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
            <Zap size={24} className="text-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Performance
            </h1>
            <p className="text-sm text-muted-foreground">
              Ferramentas de otimização
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {renderContent()}
        </div>

        {/* Pro Tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded-2xl border border-foreground/10">
          <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            Dica Pro
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeTab === "calibrator" && "Faça o teste de calibração antes de cada sessão de ranked para aquecer seu sensor de toque."}
            {activeTab === "dpi" && "Anote sua sensibilidade atual antes de testar novas DPIs. Assim você pode voltar facilmente."}
            {activeTab === "config" && "Aplique as configurações e reinicie o dispositivo para que todas as mudanças tenham efeito."}
            {activeTab === "network" && "Teste sua rede por pelo menos 30 segundos antes de decidir se está boa para jogar ranked."}
            {activeTab === "hud" && "Treine com o overlay por pelo menos 1 semana antes de competir. Muscle memory leva tempo."}
            {activeTab === "checklist" && "Complete todas as otimizações uma vez. Depois disso, só precisa refazer 'Limpar Cache' semanalmente."}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Performance;
