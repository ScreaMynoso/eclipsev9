import { useState } from "react";
import { Settings, ExternalLink, CheckCircle, ChevronRight, Smartphone, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformInstructions {
  android: string[];
  ios: string[];
}

interface OptimizationStep {
  id: string;
  title: string;
  description: string;
  fpsGain: string;
  instructions: PlatformInstructions;
  androidIntent?: string;
}

const optimizationSteps: OptimizationStep[] = [
  {
    id: "dev_options",
    title: "Ativar Opções de Desenvolvedor",
    description: "Primeiro passo para desbloquear configurações avançadas",
    fpsGain: "Necessário",
    instructions: {
      android: [
        "Vá em Configurações > Sobre o telefone",
        "Encontre 'Número da versão' ou 'Número de compilação'",
        "Toque 7 vezes seguidas até aparecer 'Você agora é um desenvolvedor!'",
        "Volte em Configurações e procure 'Opções do desenvolvedor'"
      ],
      ios: [
        "iPhone não possui 'Opções de Desenvolvedor' como Android",
        "As otimizações do iOS são feitas em Ajustes > Acessibilidade",
        "Pule este passo e continue para as próximas otimizações"
      ]
    }
  },
  {
    id: "force_gpu",
    title: "Forçar Renderização GPU",
    description: "Usa a GPU para desenhar toda a interface",
    fpsGain: "+5-10 FPS",
    androidIntent: "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    instructions: {
      android: [
        "Acesse Configurações > Opções do desenvolvedor",
        "Procure 'Forçar renderização de GPU' ou 'Force GPU rendering'",
        "Ative a opção",
        "Reinicie o celular para aplicar"
      ],
      ios: [
        "O iOS já usa a GPU automaticamente para renderização",
        "Vá em Ajustes > Geral > Atualização em 2º Plano",
        "Desative para apps que não usa frequentemente",
        "Isso libera recursos do sistema para jogos"
      ]
    }
  },
  {
    id: "msaa",
    title: "Ativar Forçar 4x MSAA",
    description: "Anti-aliasing que suaviza bordas nos gráficos",
    fpsGain: "+5-10 FPS",
    androidIntent: "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    instructions: {
      android: [
        "Acesse Configurações > Opções do desenvolvedor",
        "Procure 'Forçar 4x MSAA' ou 'Force 4x MSAA'",
        "Ative a opção (melhora qualidade visual em jogos OpenGL)",
        "Nota: pode aumentar consumo de bateria"
      ],
      ios: [
        "O iOS gerencia anti-aliasing automaticamente",
        "Mantenha seu iPhone atualizado para melhor performance",
        "Vá em Ajustes > Geral > Atualização de Software",
        "Instale a versão mais recente do iOS"
      ]
    }
  },
  {
    id: "animations",
    title: "Reduzir/Desativar Animações",
    description: "Remove animações do sistema para mais fluidez",
    fpsGain: "+5-8 FPS",
    androidIntent: "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    instructions: {
      android: [
        "Acesse Configurações > Opções do desenvolvedor",
        "Encontre 'Escala de animação da janela' → Selecione 'Desativada' ou '0.5x'",
        "Encontre 'Escala de animação de transição' → Selecione 'Desativada' ou '0.5x'",
        "Encontre 'Escala de duração do Animator' → Selecione 'Desativada' ou '0.5x'"
      ],
      ios: [
        "Vá em Ajustes > Acessibilidade > Movimento",
        "Ative 'Reduzir Movimento'",
        "Isso desativa efeitos parallax e animações de transição",
        "Torna a interface mais responsiva durante jogos"
      ]
    }
  },
  {
    id: "battery",
    title: "Desativar Economia de Bateria",
    description: "Permite que CPU e GPU rodem em velocidade máxima",
    fpsGain: "+10-20 FPS",
    androidIntent: "android.settings.BATTERY_SAVER_SETTINGS",
    instructions: {
      android: [
        "Vá em Configurações > Bateria",
        "Desative 'Economia de bateria' ou 'Modo de economia'",
        "Em alguns celulares: Configurações > Bateria > Modo de desempenho",
        "Dica: mantenha o celular carregando durante partidas ranked"
      ],
      ios: [
        "Vá em Ajustes > Bateria",
        "Desative 'Modo Pouca Energia' (ícone amarelo)",
        "Mantenha o iPhone acima de 20% de bateria",
        "Para melhor performance, jogue com o iPhone carregando"
      ]
    }
  },
  {
    id: "background",
    title: "Limitar Processos em Segundo Plano",
    description: "Libera RAM fechando apps não utilizados",
    fpsGain: "+10-20 FPS",
    androidIntent: "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
    instructions: {
      android: [
        "Acesse Configurações > Opções do desenvolvedor",
        "Procure 'Limite de processos em segundo plano'",
        "Selecione 'No máximo 2 processos' ou 'No máximo 1 processo'",
        "Antes de jogar, feche todos os apps recentes"
      ],
      ios: [
        "Vá em Ajustes > Geral > Atualização em 2º Plano",
        "Desative para todos os apps ou selecione apenas os essenciais",
        "Antes de jogar, deslize para cima e feche todos os apps",
        "No iPhone com Face ID: deslize de baixo para cima e segure"
      ]
    }
  },
  {
    id: "game_mode",
    title: "Ativar Modo Gaming / Modo Jogo",
    description: "Otimizações nativas do sistema para jogos",
    fpsGain: "+10-15 FPS",
    androidIntent: "android.settings.GAMING_SETTINGS",
    instructions: {
      android: [
        "Samsung: Game Launcher ou Game Booster nas Configurações",
        "Xiaomi: Turbo de Jogos em Configurações > Recursos especiais",
        "Outros: procure 'Modo Gaming' ou 'Game Mode' nas configurações",
        "Adicione Free Fire à lista de jogos otimizados"
      ],
      ios: [
        "iOS 18+: O Modo Jogo ativa AUTOMATICAMENTE ao abrir jogos",
        "Para verificar: abra um jogo, acesse a Central de Controle",
        "Você verá o ícone de controle indicando que Modo Jogo está ativo",
        "Ele reduz atividade em segundo plano e melhora latência do Bluetooth"
      ]
    }
  },
  {
    id: "clear_cache",
    title: "Limpar Cache do Free Fire",
    description: "Remove dados temporários corrompidos",
    fpsGain: "+5-10 FPS",
    androidIntent: "android.settings.APPLICATION_DETAILS_SETTINGS",
    instructions: {
      android: [
        "Vá em Configurações > Apps > Free Fire",
        "Toque em 'Armazenamento' ou 'Armazenamento e cache'",
        "Toque em 'Limpar cache' (NÃO toque em 'Limpar dados'!)",
        "Repita semanalmente para manter a performance"
      ],
      ios: [
        "iPhone NÃO tem botão 'Limpar Cache' para apps",
        "Método: Vá em Ajustes > Geral > Armazenamento do iPhone",
        "Encontre Free Fire e toque em 'Desinstalar App' (mantém dados de login)",
        "Reinstale pela App Store - isso limpa o cache completamente"
      ]
    }
  },
  {
    id: "graphics_ff",
    title: "Configurar Gráficos no Free Fire",
    description: "Ajustes dentro do jogo para máximo FPS",
    fpsGain: "+20-30 FPS",
    instructions: {
      android: [
        "Abra Free Fire > ⚙️ Configurações > Exibição",
        "Gráficos: Suave (prioriza FPS sobre qualidade)",
        "Sombras: Desligado",
        "Alto FPS: Ativado (se disponível no seu celular)"
      ],
      ios: [
        "Abra Free Fire > ⚙️ Configurações > Exibição",
        "Gráficos: Suave (melhor para competitivo)",
        "Sombras: Desligado",
        "Alto FPS: Ativado (iPhone 11 ou superior)"
      ]
    }
  },
  {
    id: "storage",
    title: "Liberar Espaço de Armazenamento",
    description: "Mínimo 2GB livres para performance ideal",
    fpsGain: "+5-10 FPS",
    instructions: {
      android: [
        "Vá em Configurações > Armazenamento",
        "Delete apps, fotos e vídeos não utilizados",
        "Use 'Limpar agora' ou 'Liberar espaço' se disponível",
        "Mantenha pelo menos 2-3GB livres para o jogo funcionar bem"
      ],
      ios: [
        "Vá em Ajustes > Geral > Armazenamento do iPhone",
        "Revise as 'Recomendações' para liberar espaço",
        "Delete apps não utilizados (toque > Apagar App)",
        "Mantenha pelo menos 2-3GB livres para performance ideal"
      ]
    }
  }
];

export const OptimizationChecklist = () => {
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    const saved = localStorage.getItem("optimization_steps");
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [platform, setPlatform] = useState<"android" | "ios">("android");

  const toggleComplete = (e: React.MouseEvent, stepId: string) => {
    e.stopPropagation();
    const newCompleted = completedSteps.includes(stepId)
      ? completedSteps.filter(id => id !== stepId)
      : [...completedSteps, stepId];
    
    setCompletedSteps(newCompleted);
    localStorage.setItem("optimization_steps", JSON.stringify(newCompleted));
  };

  const toggleExpand = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const openSettings = (step: OptimizationStep) => {
    if (platform === "android" && step.androidIntent) {
      const intentUrl = `intent://#Intent;action=${step.androidIntent};end`;
      const link = document.createElement("a");
      link.href = intentUrl;
      link.click();
    }
    
    toast({
      title: "Abrir Configurações",
      description: platform === "android" 
        ? "Se não abriu automaticamente, siga as instruções na tela."
        : "Siga as instruções para ajustar no seu iPhone.",
    });
  };

  const completionPercentage = Math.round((completedSteps.length / optimizationSteps.length) * 100);

  const totalFpsGain = optimizationSteps
    .filter(s => completedSteps.includes(s.id))
    .reduce((total, step) => {
      const match = step.fpsGain.match(/\+(\d+)/);
      return total + (match ? parseInt(match[1]) : 0);
    }, 0);

  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <Settings size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Checklist de Ouro</h3>
          <p className="text-xs text-muted-foreground">Otimização manual assistida</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Platform Selector */}
        <Tabs value={platform} onValueChange={(v) => setPlatform(v as "android" | "ios")} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="android" className="flex items-center gap-2">
              <Smartphone size={16} />
              Android
            </TabsTrigger>
            <TabsTrigger value="ios" className="flex items-center gap-2">
              <Apple size={16} />
              iPhone
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Progress */}
        <div className="p-3 bg-secondary/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="text-sm font-bold text-foreground">
              {completedSteps.length}/{optimizationSteps.length}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          {totalFpsGain > 0 && (
            <p className="text-xs text-green-400 mt-2 text-center">
              Ganho estimado: +{totalFpsGain} FPS
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {optimizationSteps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isExpanded = expandedStep === step.id;
            const instructions = step.instructions[platform];

            return (
              <div
                key={step.id}
                className={`rounded-xl overflow-hidden transition-all cursor-pointer ${
                  isCompleted ? "bg-green-500/10 border border-green-500/30" : "bg-secondary/30 hover:bg-secondary/50"
                }`}
                onClick={() => toggleExpand(step.id)}
              >
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleComplete(e, step.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-muted-foreground hover:border-foreground"
                      }`}
                    >
                      {isCompleted && <CheckCircle size={14} className="text-white" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-medium text-sm ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {step.title}
                        </h4>
                        <span className="text-xs text-green-400 font-medium">{step.fpsGain}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="ml-9 space-y-2 bg-secondary/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                        {platform === "android" ? (
                          <Smartphone size={14} className="text-green-400" />
                        ) : (
                          <Apple size={14} className="text-gray-300" />
                        )}
                        <span className="text-xs font-semibold text-foreground">
                          {platform === "android" ? "Android" : "iPhone (iOS)"}
                        </span>
                      </div>
                      {instructions.map((instruction, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-foreground font-bold text-xs min-w-[20px]">{i + 1}.</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{instruction}</p>
                        </div>
                      ))}
                    </div>
                    
                    {platform === "android" && step.androidIntent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSettings(step)}
                        className="w-full ml-9 max-w-[calc(100%-2.25rem)]"
                      >
                        <Smartphone size={14} className="mr-2" />
                        Abrir Configuração
                        <ExternalLink size={12} className="ml-auto" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {completedSteps.length === optimizationSteps.length && (
          <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30 text-center">
            <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
            <h4 className="font-bold text-foreground">Parabéns!</h4>
            <p className="text-xs text-muted-foreground">
              Seu {platform === "android" ? "Android" : "iPhone"} está 100% otimizado para Free Fire!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
