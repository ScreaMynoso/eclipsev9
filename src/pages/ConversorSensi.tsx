import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRightLeft, Copy, Heart, RotateCcw, Smartphone, Monitor, Apple, Zap, Scale, Target, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Platform = "emulador" | "android" | "ios";
type SensiFeedback = "lenta" | "balanceada" | "rapida";
type CursorMode = "individual" | "refinado" | "preciso";

interface GameSensitivities {
  sensiGeral: number;
  redDot: number;
  mira2x: number;
  mira4x: number;
  awmSniper: number;
  olhadinha: number;
}

interface ConversionResult {
  from: Platform;
  to: Platform;
  originalValues: Record<string, number | string>;
  gameSensi: GameSensitivities;
  platformConfig: Record<string, number | string>;
  feedback: SensiFeedback;
  feedbackScore: number;
}

const platforms: { id: Platform; name: string; icon: typeof Monitor; description: string }[] = [
  { id: "emulador", name: "Emulador", icon: Monitor, description: "BlueStacks, MSI, etc" },
  { id: "android", name: "Android", icon: Smartphone, description: "Samsung, Xiaomi, etc" },
  { id: "ios", name: "iOS", icon: Apple, description: "iPhone (Cursor Móvel)" },
];

const cursorModes: { id: CursorMode; name: string; description: string; multiplier: number }[] = [
  { id: "individual", name: "Individual", description: "Toques únicos, mais controle", multiplier: 0.8 },
  { id: "refinado", name: "Refinado", description: "Equilíbrio entre precisão e velocidade", multiplier: 1.0 },
  { id: "preciso", name: "Preciso", description: "Máxima precisão, movimentos suaves", multiplier: 1.2 },
];

// Valores padrão
const DEFAULT_ANDROID_DPI = 480;
const DEFAULT_IOS_CYCLE = 50; // Velocidade do cursor padrão

// Converte configuração do emulador para velocidade base
const emulatorToBaseSpeed = (dpiMouse: number, sensiX: number, sensiY: number): number => {
  const dpiNormalized = dpiMouse / 800;
  const sensiMedia = (sensiX + sensiY) / 2;
  return dpiNormalized * sensiMedia * 100;
};

// Converte configuração Android para velocidade base
const androidToBaseSpeed = (dpiCelular: number, sensiGeral: number): number => {
  const dpiNormalized = 480 / dpiCelular;
  return dpiNormalized * sensiGeral;
};

// Converte configuração iOS (Cursor Móvel) para velocidade base
const iosToBaseSpeed = (velocidadeCursor: number, modo: CursorMode): number => {
  const modeConfig = cursorModes.find(m => m.id === modo);
  const modeMultiplier = modeConfig?.multiplier || 1.0;
  return velocidadeCursor * modeMultiplier * 2;
};

// Converte velocidade base para configuração de emulador
const baseSpeedToEmulator = (baseSpeed: number): { dpiMouse: number; sensiX: number; sensiY: number } => {
  const dpiMouse = 800;
  let sensiMedia = baseSpeed / 100;
  sensiMedia = Math.max(0.1, Math.min(10, sensiMedia));
  sensiMedia = Math.round(sensiMedia * 100) / 100;
  return { dpiMouse, sensiX: sensiMedia, sensiY: sensiMedia };
};

// Converte velocidade base para configuração Android
const baseSpeedToAndroid = (baseSpeed: number, useDefaultDpi: boolean): { dpiCelular: number; sensiGeral: number } => {
  const dpiCelular = useDefaultDpi ? DEFAULT_ANDROID_DPI : 480;
  let sensiGeral = baseSpeed;
  sensiGeral = Math.max(50, Math.min(200, Math.round(sensiGeral)));
  return { dpiCelular, sensiGeral };
};

// Converte velocidade base para configuração iOS (Cursor Móvel)
const baseSpeedToIOS = (baseSpeed: number, useDefaultCycle: boolean): { velocidadeCursor: number; modo: CursorMode } => {
  let modo: CursorMode;
  let modeMultiplier: number;
  
  if (baseSpeed < 80) {
    modo = "individual";
    modeMultiplier = 0.8;
  } else if (baseSpeed <= 130) {
    modo = "refinado";
    modeMultiplier = 1.0;
  } else {
    modo = "preciso";
    modeMultiplier = 1.2;
  }
  
  let velocidadeCursor = useDefaultCycle ? DEFAULT_IOS_CYCLE : Math.round(baseSpeed / (modeMultiplier * 2));
  velocidadeCursor = Math.max(1, Math.min(100, velocidadeCursor));
  
  return { velocidadeCursor, modo };
};

// Converte sensibilidades completas baseado em proporções
const convertGameSensitivities = (
  inputSensi: GameSensitivities,
  multiplier: number
): GameSensitivities => {
  const clamp = (val: number) => Math.max(50, Math.min(200, Math.round(val * multiplier)));
  return {
    sensiGeral: clamp(inputSensi.sensiGeral),
    redDot: clamp(inputSensi.redDot),
    mira2x: clamp(inputSensi.mira2x),
    mira4x: clamp(inputSensi.mira4x),
    awmSniper: clamp(inputSensi.awmSniper),
    olhadinha: clamp(inputSensi.olhadinha),
  };
};

// Determina o feedback baseado na sensibilidade
const getSensiFeedback = (sensiGeral: number): { feedback: SensiFeedback; score: number } => {
  if (sensiGeral < 85) {
    return { feedback: "lenta", score: sensiGeral };
  } else if (sensiGeral <= 120) {
    return { feedback: "balanceada", score: sensiGeral };
  } else {
    return { feedback: "rapida", score: sensiGeral };
  }
};

const feedbackConfig: Record<SensiFeedback, { label: string; color: string; icon: typeof Scale; description: string }> = {
  lenta: {
    label: "Lenta",
    color: "text-blue-400 bg-blue-400/20 border-blue-400/50",
    icon: Target,
    description: "Mais precisão, ideal para snipers e jogadas calculadas",
  },
  balanceada: {
    label: "Balanceada",
    color: "text-green-400 bg-green-400/20 border-green-400/50",
    icon: Scale,
    description: "Equilíbrio entre controle e velocidade",
  },
  rapida: {
    label: "Rápida",
    color: "text-orange-400 bg-orange-400/20 border-orange-400/50",
    icon: Zap,
    description: "Reações rápidas, ideal para rushar e close combat",
  },
};

const ConversorSensi = () => {
  const [fromPlatform, setFromPlatform] = useState<Platform>("android");
  const [toPlatform, setToPlatform] = useState<Platform>("emulador");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Opções de uso de valores padrão
  const [useDefaultAndroidDpi, setUseDefaultAndroidDpi] = useState(true);
  const [useDefaultIosCycle, setUseDefaultIosCycle] = useState(true);

  // Inputs por plataforma
  const [emuladorValues, setEmuladorValues] = useState({ dpiMouse: 800, sensiX: 1, sensiY: 1 });
  const [androidValues, setAndroidValues] = useState({ dpiCelular: DEFAULT_ANDROID_DPI, sensiGeral: 100 });
  const [iosValues, setIosValues] = useState<{ velocidadeCursor: number; modo: CursorMode }>({ 
    velocidadeCursor: DEFAULT_IOS_CYCLE, 
    modo: "refinado" 
  });
  
  // Sensibilidades completas do jogo (entrada)
  const [inputGameSensi, setInputGameSensi] = useState<GameSensitivities>({
    sensiGeral: 100,
    redDot: 95,
    mira2x: 85,
    mira4x: 75,
    awmSniper: 65,
    olhadinha: 115,
  });
  
  // Modo de conversão: simples (só geral) ou completo (todas as sensi)
  const [fullMode, setFullMode] = useState(false);

  // Auto-scroll para o resultado quando gerado
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const getInputValues = (): Record<string, number | string> => {
    switch (fromPlatform) {
      case "emulador":
        return emuladorValues;
      case "android":
        return { ...androidValues, ...(fullMode ? inputGameSensi : {}) };
      case "ios":
        return { ...iosValues, ...(fullMode ? inputGameSensi : {}) };
      default:
        return {};
    }
  };

  const handleConvert = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const inputValues = getInputValues();
      
      // Passo 1: Converter para velocidade base universal
      let baseSpeed: number;
      const basesensiGeral = fullMode ? inputGameSensi.sensiGeral : (inputValues.sensiGeral as number || 100);
      
      switch (fromPlatform) {
        case "emulador":
          baseSpeed = emulatorToBaseSpeed(
            inputValues.dpiMouse as number,
            inputValues.sensiX as number,
            inputValues.sensiY as number
          );
          break;
        case "android":
          baseSpeed = androidToBaseSpeed(
            inputValues.dpiCelular as number, 
            basesensiGeral
          );
          break;
        case "ios":
          baseSpeed = iosToBaseSpeed(
            inputValues.velocidadeCursor as number, 
            inputValues.modo as CursorMode
          );
          break;
        default:
          baseSpeed = 100;
      }

      // Passo 2: Converter velocidade base para plataforma destino
      let platformConfig: Record<string, number | string>;
      let targetSensiGeral: number;
      
      switch (toPlatform) {
        case "emulador": {
          const emu = baseSpeedToEmulator(baseSpeed);
          platformConfig = emu;
          targetSensiGeral = baseSpeed;
          break;
        }
        case "android": {
          const android = baseSpeedToAndroid(baseSpeed, useDefaultAndroidDpi);
          platformConfig = android;
          targetSensiGeral = android.sensiGeral;
          break;
        }
        case "ios": {
          const ios = baseSpeedToIOS(baseSpeed, useDefaultIosCycle);
          platformConfig = ios;
          targetSensiGeral = baseSpeed;
          break;
        }
        default:
          platformConfig = {};
          targetSensiGeral = 100;
      }

      // Passo 3: Calcular multiplicador de conversão
      const multiplier = targetSensiGeral / basesensiGeral;
      
      // Passo 4: Converter todas as sensibilidades
      const gameSensi = fullMode 
        ? convertGameSensitivities(inputGameSensi, multiplier)
        : {
            sensiGeral: Math.round(Math.max(50, Math.min(200, targetSensiGeral))),
            redDot: Math.round(Math.max(50, Math.min(200, targetSensiGeral * 0.95))),
            mira2x: Math.round(Math.max(50, Math.min(200, targetSensiGeral * 0.85))),
            mira4x: Math.round(Math.max(50, Math.min(200, targetSensiGeral * 0.75))),
            awmSniper: Math.round(Math.max(50, Math.min(200, targetSensiGeral * 0.65))),
            olhadinha: Math.round(Math.max(50, Math.min(200, targetSensiGeral * 1.15))),
          };
      
      const { feedback, score } = getSensiFeedback(gameSensi.sensiGeral);

      setResult({
        from: fromPlatform,
        to: toPlatform,
        originalValues: inputValues,
        platformConfig,
        gameSensi,
        feedback,
        feedbackScore: score,
      });

      setIsLoading(false);
      toast.success("Conversão realizada com sucesso!");
    }, 800);
  };

  const copyAll = () => {
    if (!result) return;
    
    const platformName = platforms.find(p => p.id === result.to)?.name;
    
    let platformValues = "";
    if (result.to === "emulador") {
      platformValues = `DPI do Mouse: ${result.platformConfig.dpiMouse}\nSensibilidade X: ${result.platformConfig.sensiX}\nSensibilidade Y: ${result.platformConfig.sensiY}`;
    } else if (result.to === "android") {
      platformValues = `DPI do Celular: ${result.platformConfig.dpiCelular}\nSensibilidade Geral: ${result.platformConfig.sensiGeral}`;
    } else {
      const modeName = cursorModes.find(m => m.id === result.platformConfig.modo)?.name;
      platformValues = `Modo de Sessão: ${modeName}\nVelocidade do Cursor: ${result.platformConfig.velocidadeCursor}`;
    }
    
    const gameValues = `
Geral: ${result.gameSensi.sensiGeral}
Red Dot: ${result.gameSensi.redDot}
Mira 2x: ${result.gameSensi.mira2x}
Mira 4x: ${result.gameSensi.mira4x}
AWM/Sniper: ${result.gameSensi.awmSniper}
Olhadinha: ${result.gameSensi.olhadinha}`;
    
    navigator.clipboard.writeText(
      `🎮 Sensibilidade ${platformName}:\n${platformValues}\n\n📊 Config do Jogo:${gameValues}\n\n⚡ Tipo: ${feedbackConfig[result.feedback].label}`
    );
    toast.success("Valores copiados!");
  };

  const saveFavorite = () => {
    if (!result) return;
    
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const platformName = platforms.find(p => p.id === result.to)?.name;
    favorites.push({
      id: Date.now(),
      type: "conversor",
      name: `Conversão para ${platformName}`,
      data: result,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    toast.success("Salvo nos favoritos!");
  };

  const renderInputs = () => {
    switch (fromPlatform) {
      case "emulador":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">DPI do Mouse</Label>
              <Input
                type="number"
                value={emuladorValues.dpiMouse}
                onChange={(e) => setEmuladorValues({ ...emuladorValues, dpiMouse: Number(e.target.value) })}
                className="input-eclipse mt-1"
                placeholder="Ex: 800"
              />
              <span className="text-xs text-muted-foreground">Padrão: 400-1600</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-sm">Sensibilidade X</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={emuladorValues.sensiX}
                  onChange={(e) => setEmuladorValues({ ...emuladorValues, sensiX: Number(e.target.value) })}
                  className="input-eclipse mt-1"
                  placeholder="Ex: 1.0"
                />
                <span className="text-xs text-muted-foreground">Range: 0.1 - 10</span>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Sensibilidade Y</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={emuladorValues.sensiY}
                  onChange={(e) => setEmuladorValues({ ...emuladorValues, sensiY: Number(e.target.value) })}
                  className="input-eclipse mt-1"
                  placeholder="Ex: 1.0"
                />
                <span className="text-xs text-muted-foreground">Range: 0.1 - 10</span>
              </div>
            </div>
          </div>
        );

      case "android":
        return (
          <div className="space-y-4">
            {/* Toggle DPI Padrão */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <div>
                <span className="text-sm text-foreground font-medium">DPI Padrão Android</span>
                <p className="text-xs text-muted-foreground">Usar DPI 480 (recomendado)</p>
              </div>
              <button
                onClick={() => {
                  setUseDefaultAndroidDpi(!useDefaultAndroidDpi);
                  if (!useDefaultAndroidDpi) {
                    setAndroidValues({ ...androidValues, dpiCelular: DEFAULT_ANDROID_DPI });
                  }
                }}
                className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${
                  useDefaultAndroidDpi ? "bg-green-500" : "bg-muted"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all flex items-center justify-center ${
                  useDefaultAndroidDpi ? "translate-x-5" : "translate-x-0"
                }`}>
                  {useDefaultAndroidDpi && <Check size={12} className="text-green-600" />}
                </div>
              </button>
            </div>
            
            {!useDefaultAndroidDpi && (
              <div>
                <Label className="text-muted-foreground text-sm">DPI do Celular</Label>
                <Input
                  type="number"
                  value={androidValues.dpiCelular}
                  onChange={(e) => setAndroidValues({ ...androidValues, dpiCelular: Number(e.target.value) })}
                  className="input-eclipse mt-1"
                  placeholder="Ex: 480"
                />
                <span className="text-xs text-muted-foreground">Padrão: 320-640 (menor = mais rápido)</span>
              </div>
            )}
            
            {!fullMode && (
              <div>
                <Label className="text-muted-foreground text-sm">Sensibilidade Geral do Jogo</Label>
                <Input
                  type="number"
                  min="50"
                  max="200"
                  value={androidValues.sensiGeral}
                  onChange={(e) => setAndroidValues({ ...androidValues, sensiGeral: Number(e.target.value) })}
                  className="input-eclipse mt-1"
                  placeholder="Ex: 100"
                />
                <span className="text-xs text-muted-foreground">Range: 50 - 200</span>
              </div>
            )}
          </div>
        );

      case "ios":
        return (
          <div className="space-y-4">
            {/* Info sobre Cursor Móvel */}
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Ajustes:</strong> Acessibilidade → Controle Assistivo → Cursor Móvel
              </p>
            </div>
            
            {/* Toggle Ciclo Padrão */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <div>
                <span className="text-sm text-foreground font-medium">Ciclo Padrão iPhone</span>
                <p className="text-xs text-muted-foreground">Usar velocidade 50 (recomendado)</p>
              </div>
              <button
                onClick={() => {
                  setUseDefaultIosCycle(!useDefaultIosCycle);
                  if (!useDefaultIosCycle) {
                    setIosValues({ ...iosValues, velocidadeCursor: DEFAULT_IOS_CYCLE });
                  }
                }}
                className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${
                  useDefaultIosCycle ? "bg-green-500" : "bg-muted"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all flex items-center justify-center ${
                  useDefaultIosCycle ? "translate-x-5" : "translate-x-0"
                }`}>
                  {useDefaultIosCycle && <Check size={12} className="text-green-600" />}
                </div>
              </button>
            </div>
            
            {/* Modo de Sessão */}
            <div>
              <Label className="text-muted-foreground text-sm mb-2 block">Modo de Sessão</Label>
              <div className="grid grid-cols-3 gap-2">
                {cursorModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setIosValues({ ...iosValues, modo: mode.id })}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      iosValues.modo === mode.id
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xs font-medium block">{mode.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {cursorModes.find(m => m.id === iosValues.modo)?.description}
              </p>
            </div>

            {/* Velocidade do Cursor */}
            {!useDefaultIosCycle && (
              <div>
                <Label className="text-muted-foreground text-sm">Velocidade do Cursor Móvel</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={iosValues.velocidadeCursor}
                  onChange={(e) => setIosValues({ ...iosValues, velocidadeCursor: Number(e.target.value) })}
                  className="input-eclipse mt-1"
                  placeholder="Ex: 50"
                />
                <span className="text-xs text-muted-foreground">Range: 1 - 100</span>
              </div>
            )}
          </div>
        );
    }
  };
  
  const renderFullSensiInputs = () => {
    if (!fullMode) return null;
    
    const sensiFields = [
      { key: "sensiGeral", label: "Geral" },
      { key: "redDot", label: "Red Dot" },
      { key: "mira2x", label: "Mira 2x" },
      { key: "mira4x", label: "Mira 4x" },
      { key: "awmSniper", label: "AWM/Sniper" },
      { key: "olhadinha", label: "Olhadinha" },
    ];
    
    return (
      <div className="glass-card p-4 rounded-2xl">
        <Label className="text-foreground font-medium text-sm mb-3 block">
          Sensibilidades do Jogo (Origem)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {sensiFields.map(({ key, label }) => (
            <div key={key}>
              <Label className="text-muted-foreground text-xs">{label}</Label>
              <Input
                type="number"
                min="50"
                max="200"
                value={inputGameSensi[key as keyof GameSensitivities]}
                onChange={(e) => setInputGameSensi({ 
                  ...inputGameSensi, 
                  [key]: Number(e.target.value) 
                })}
                className="input-eclipse mt-1"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeedbackBadge = () => {
    if (!result) return null;
    
    const config = feedbackConfig[result.feedback];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <div className={`p-4 rounded-xl border ${config.color}`}>
        <div className="flex items-center gap-3">
          <Icon size={24} />
          <div>
            <div className="font-semibold text-lg">{config.label}</div>
            <div className="text-xs opacity-80">{config.description}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-current rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (result.feedbackScore / 200) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium">{Math.round(result.feedbackScore)}</span>
        </div>
      </div>
    );
  };

  const renderPlatformConfig = () => {
    if (!result) return null;

    if (result.to === "emulador") {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground text-sm">DPI do Mouse</span>
            <span className="text-primary font-bold text-lg">{result.platformConfig.dpiMouse}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground text-sm">Sensibilidade X</span>
            <span className="text-primary font-bold text-lg">{result.platformConfig.sensiX}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground text-sm">Sensibilidade Y</span>
            <span className="text-primary font-bold text-lg">{result.platformConfig.sensiY}</span>
          </div>
        </div>
      );
    }

    if (result.to === "android") {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground text-sm">DPI do Celular</span>
            <span className="text-primary font-bold text-lg">{result.platformConfig.dpiCelular}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground text-sm">Sensibilidade Geral</span>
            <span className="text-primary font-bold text-lg">{result.platformConfig.sensiGeral}</span>
          </div>
        </div>
      );
    }

    // iOS - Cursor Móvel
    const modeName = cursorModes.find(m => m.id === result.platformConfig.modo)?.name;
    return (
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-3">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Configure em:</strong> Ajustes → Acessibilidade → Controle Assistivo → Cursor Móvel
          </p>
        </div>
        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
          <span className="text-muted-foreground text-sm">Modo de Sessão</span>
          <span className="text-primary font-bold text-lg">{modeName}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
          <span className="text-muted-foreground text-sm">Velocidade do Cursor</span>
          <span className="text-primary font-bold text-lg">{result.platformConfig.velocidadeCursor}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl bg-card hover:bg-card/80 transition-colors">
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Conversor de Sensi</h1>
            <p className="text-xs text-muted-foreground">Converta entre plataformas</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Info Card */}
        <div className="glass-card p-4 rounded-2xl neon-border">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ArrowRightLeft size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground text-sm">Conversão Cross-Platform</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Converta sua sensibilidade entre Emulador, Android e iOS (Cursor Móvel) mantendo a mesma velocidade de mira.
              </p>
            </div>
          </div>
        </div>
        
        {/* Toggle Modo Completo */}
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-foreground font-medium">Modo Completo</span>
              <p className="text-xs text-muted-foreground">Converter todas as sensibilidades (Geral, Miras, AWM, etc)</p>
            </div>
            <button
              onClick={() => setFullMode(!fullMode)}
              className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${
                fullMode ? "bg-green-500" : "bg-muted"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-all flex items-center justify-center ${
                fullMode ? "translate-x-5" : "translate-x-0"
              }`}>
                {fullMode && <Check size={12} className="text-green-600" />}
              </div>
            </button>
          </div>
        </div>

        {/* Plataforma de Origem */}
        <div className="glass-card p-4 rounded-2xl">
          <Label className="text-foreground font-medium text-sm mb-3 block">Plataforma de Origem</Label>
          <div className="grid grid-cols-3 gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = fromPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => {
                    setFromPlatform(platform.id);
                    if (toPlatform === platform.id) {
                      const otherPlatforms = platforms.filter(p => p.id !== platform.id);
                      setToPlatform(otherPlatforms[0].id);
                    }
                    setResult(null);
                  }}
                  className={`p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Icon size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-medium block">{platform.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs Dinâmicos */}
        <div className="glass-card p-4 rounded-2xl">
          <Label className="text-foreground font-medium text-sm mb-3 block">
            Configurações de {platforms.find(p => p.id === fromPlatform)?.name}
          </Label>
          {renderInputs()}
        </div>
        
        {/* Inputs de Sensibilidades Completas */}
        {renderFullSensiInputs()}

        {/* Plataforma de Destino */}
        <div className="glass-card p-4 rounded-2xl">
          <Label className="text-foreground font-medium text-sm mb-3 block">Plataforma de Destino</Label>
          <div className="grid grid-cols-3 gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = toPlatform === platform.id;
              const isDisabled = fromPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => !isDisabled && setToPlatform(platform.id)}
                  disabled={isDisabled}
                  className={`p-3 rounded-xl border transition-all ${
                    isDisabled
                      ? "opacity-30 cursor-not-allowed bg-card border-border"
                      : isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Icon size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-medium block">{platform.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botão Converter */}
        <Button
          onClick={handleConvert}
          disabled={isLoading}
          className="w-full btn-eclipse py-6 text-base font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RotateCcw size={18} className="animate-spin" />
              Convertendo...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowRightLeft size={18} />
              Converter Sensibilidade
            </span>
          )}
        </Button>

        {/* Resultado */}
        {result && (
          <div ref={resultRef} id="result" className="space-y-4 animate-fade-in scroll-mt-4">
            {/* Feedback Badge */}
            {renderFeedbackBadge()}

            {/* Configuração da Plataforma */}
            <div className="glass-card p-4 rounded-2xl neon-border">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Config para {platforms.find(p => p.id === result.to)?.name}
              </h3>
              {renderPlatformConfig()}
            </div>

            {/* Sensibilidades do Jogo */}
            <div className="glass-card p-4 rounded-2xl neon-border">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Sensibilidades do Jogo (Free Fire)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground text-xs">Geral</span>
                  <span className="text-primary font-bold">{result.gameSensi.sensiGeral}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground text-xs">Red Dot</span>
                  <span className="text-primary font-bold">{result.gameSensi.redDot}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground text-xs">Mira 2x</span>
                  <span className="text-primary font-bold">{result.gameSensi.mira2x}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground text-xs">Mira 4x</span>
                  <span className="text-primary font-bold">{result.gameSensi.mira4x}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground text-xs">AWM/Sniper</span>
                  <span className="text-primary font-bold">{result.gameSensi.awmSniper}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground text-xs">Olhadinha</span>
                  <span className="text-primary font-bold">{result.gameSensi.olhadinha}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setResult(null);
                  handleConvert();
                }}
                variant="outline"
                className="flex-1 gap-2"
              >
                <RotateCcw size={16} />
                Reconverter
              </Button>
              <Button
                onClick={copyAll}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Copy size={16} />
                Copiar
              </Button>
              <Button
                onClick={saveFavorite}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Heart size={16} />
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversorSensi;