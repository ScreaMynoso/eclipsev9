import { useState } from "react";
import { ArrowLeft, Smartphone, Copy, Heart, RefreshCw, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "@/hooks/use-toast";

interface CiclosResult {
  model: string;
  preference: string;
  mode: string;
  cycles: number[];
  avgCycle: number;
}

const iphoneModels = [
  { id: "xr", name: "iPhone XR" },
  { id: "11", name: "iPhone 11" },
  { id: "12", name: "iPhone 12" },
  { id: "13", name: "iPhone 13" },
  { id: "14", name: "iPhone 14" },
  { id: "15", name: "iPhone 15" },
  { id: "16", name: "iPhone 16" },
  { id: "17", name: "iPhone 17" },
];

const preferences = ["Controle", "Balanceado", "Rápido"];
const modes = ["Refinado", "Individual", "Preciso"];

const modelPerformance: Record<string, number> = {
  xr: 60,
  "11": 70,
  "12": 80,
  "13": 90,
  "14": 100,
  "15": 110,
  "16": 115,
  "17": 120,
};

const preferenceModifiers: Record<string, number> = {
  "Controle": -15,
  "Balanceado": 0,
  "Rápido": 20,
};

const generateCycles = (model: string, preference: string, mode: string): number[] => {
  const basePerformance = modelPerformance[model] || 80;
  const prefMod = preferenceModifiers[preference] || 0;
  
  const cycleCount = mode === "Individual" ? 1 : mode === "Preciso" ? 5 : 3;
  const cycles: number[] = [];
  
  for (let i = 0; i < cycleCount; i++) {
    const baseCycle = basePerformance + prefMod;
    const variance = Math.floor((Math.random() - 0.5) * 20);
    const cycle = Math.max(31, Math.min(120, baseCycle + variance));
    cycles.push(cycle);
  }
  
  return cycles;
};

const CiclosIphone = () => {
  const [selectedModel, setSelectedModel] = useState("14");
  const [selectedPreference, setSelectedPreference] = useState("Balanceado");
  const [selectedMode, setSelectedMode] = useState("Refinado");
  const [result, setResult] = useState<CiclosResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const cycles = generateCycles(selectedModel, selectedPreference, selectedMode);
      const model = iphoneModels.find(m => m.id === selectedModel)?.name || "iPhone";
      
      setResult({
        model,
        preference: selectedPreference,
        mode: selectedMode,
        cycles,
        avgCycle: Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length),
      });
      setIsGenerating(false);
    }, 600);
  };

  const copyAll = () => {
    if (!result) return;
    const cyclesText = result.cycles.map((c, i) => `Ciclo ${i + 1}: ${c}`).join("\n");
    const text = `Ciclos iPhone
Modelo: ${result.model}
Preferência: ${result.preference}
Modo: ${result.mode}
Média: ${result.avgCycle}
${cyclesText}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Tudo copiado!", description: "Ciclos copiados para a área de transferência" });
  };

  const saveFavorite = () => {
    if (!result) return;
    const favorites = JSON.parse(localStorage.getItem("eclipse_favorites") || "[]");
    const newFavorite = {
      id: Date.now().toString(),
      type: "ciclos_iphone",
      name: `Ciclos ${result.model} - ${result.avgCycle}`,
      data: result,
      createdAt: new Date().toISOString(),
    };
    favorites.push(newFavorite);
    localStorage.setItem("eclipse_favorites", JSON.stringify(favorites));
    toast({ title: "Salvo!", description: "Adicionado aos favoritos" });
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link 
            to="/"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Ciclos (iPhone)
            </h1>
            <p className="text-sm text-muted-foreground">
              Geração automática de ciclos
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-6 flex gap-3">
          <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Ciclos são gerados automaticamente no formato 31 até 120. Escolha o estilo e o modo de geração.
          </p>
        </div>

        {/* Model Selection */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">Modelo do iPhone:</label>
          <input
            type="text"
            value={iphoneModels.find(m => m.id === selectedModel)?.name || ""}
            readOnly
            placeholder="Ex: iPhone 14 Pro..."
            className="input-eclipse mb-3"
          />
          <div className="flex flex-wrap gap-2">
            {iphoneModels.slice(0, 8).map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                  selectedModel === model.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {model.id === "xr" ? "XR" : model.id}
              </button>
            ))}
          </div>
        </div>

        {/* Preference Selection */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-3 block">Preferência:</label>
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <button
                key={pref}
                onClick={() => setSelectedPreference(pref)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPreference === pref
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Valores médios (50-100) para versatilidade
          </p>
        </div>

        {/* Mode Selection */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Modo de geração:</label>
          <div className="flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedMode === "Refinado" ? "Ciclo otimizado para precisão (3 valores)" : 
             selectedMode === "Individual" ? "Um único ciclo personalizado" : 
             "Múltiplos ciclos para análise (5 valores)"}
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-eclipse w-full font-display flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Smartphone size={18} className="animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Smartphone size={18} />
              Gerar Ciclos
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="glass-card p-4 rounded-2xl animate-fade-in">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-primary">
                Ciclos Gerados
              </h3>
              <p className="text-sm text-muted-foreground">
                {result.model} • {result.preference} • {result.mode}
              </p>
            </div>

            <div className="text-center py-6 bg-foreground/5 rounded-xl mb-4">
              <p className="text-muted-foreground text-sm mb-2">Média dos Ciclos</p>
              <span className="font-display text-5xl font-bold text-primary">{result.avgCycle}</span>
            </div>

            <div className="space-y-0 border border-border/30 rounded-xl overflow-hidden mb-4">
              {result.cycles.map((cycle, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 ${
                    index % 2 === 0 ? "bg-foreground/5" : "bg-transparent"
                  }`}
                >
                  <span className="text-foreground">Ciclo {index + 1}</span>
                  <span className="text-primary font-bold text-lg">{cycle}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm"
              >
                <RefreshCw size={16} />
                Gerar de novo
              </button>
              <button
                onClick={copyAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/10 text-foreground font-medium text-sm"
              >
                <Copy size={16} />
                Copiar tudo
              </button>
              <button
                onClick={saveFavorite}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/20 text-primary font-medium text-sm"
              >
                <Heart size={16} />
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CiclosIphone;
