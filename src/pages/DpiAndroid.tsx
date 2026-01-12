import { useState, useRef } from "react";
import { ArrowLeft, Smartphone, Copy, Heart, RefreshCw, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "@/hooks/use-toast";

interface DpiResult {
  brand: string;
  model: string;
  profile: string;
  objective: string;
  dpi: number;
  resolution: string;
  touchSampling: string;
}

const brands = [
  { id: "android", name: "Android (Geral)" },
  { id: "xiaomi", name: "Xiaomi" },
  { id: "motorola", name: "Motorola" },
  { id: "samsung", name: "Samsung" },
  { id: "asus", name: "Asus Rog Phone" },
];

const profiles = ["Fraco", "Médio", "Forte"];
const objectives = ["Mais controle", "Balanceado", "Mais rápido"];

const brandDpiRanges: Record<string, { min: number; max: number }> = {
  android: { min: 400, max: 520 },
  xiaomi: { min: 420, max: 560 },
  motorola: { min: 380, max: 480 },
  samsung: { min: 440, max: 580 },
  asus: { min: 500, max: 640 },
};

const profileModifiers: Record<string, number> = {
  "Fraco": -40,
  "Médio": 0,
  "Forte": 50,
};

const objectiveModifiers: Record<string, number> = {
  "Mais controle": -30,
  "Balanceado": 0,
  "Mais rápido": 40,
};

const generateDpi = (brand: string, profile: string, objective: string): number => {
  const range = brandDpiRanges[brand] || brandDpiRanges.android;
  const baseDpi = (range.min + range.max) / 2;
  const profileMod = profileModifiers[profile] || 0;
  const objectiveMod = objectiveModifiers[objective] || 0;
  const variance = Math.floor((Math.random() - 0.5) * 40);
  
  return Math.max(range.min, Math.min(range.max, Math.floor(baseDpi + profileMod + objectiveMod + variance)));
};

const DpiAndroid = () => {
  const [selectedBrand, setSelectedBrand] = useState("android");
  const [customModel, setCustomModel] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("Médio");
  const [selectedObjective, setSelectedObjective] = useState("Balanceado");
  const [result, setResult] = useState<DpiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const dpi = generateDpi(selectedBrand, selectedProfile, selectedObjective);
      const brand = brands.find(b => b.id === selectedBrand)?.name || "Android";
      
      setResult({
        brand,
        model: customModel || "Modelo padrão",
        profile: selectedProfile,
        objective: selectedObjective,
        dpi,
        resolution: selectedProfile === "Forte" ? "1080p" : selectedProfile === "Médio" ? "720p" : "540p",
        touchSampling: selectedProfile === "Forte" ? "240Hz" : selectedProfile === "Médio" ? "120Hz" : "60Hz",
      });
      setIsGenerating(false);
      // Auto-scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 600);
  };

  const copyAll = () => {
    if (!result) return;
    const text = `DPI Android
Marca: ${result.brand}
Modelo: ${result.model}
Perfil: ${result.profile}
Objetivo: ${result.objective}
DPI Recomendado: ${result.dpi}
Resolução: ${result.resolution}
Touch Sampling: ${result.touchSampling}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Tudo copiado!", description: "DPI copiado para a área de transferência" });
  };

  const saveFavorite = () => {
    if (!result) return;
    const favorites = JSON.parse(localStorage.getItem("eclipse_favorites") || "[]");
    const newFavorite = {
      id: Date.now().toString(),
      type: "dpi_android",
      name: `DPI ${result.brand} - ${result.dpi}`,
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
              DPI (Android)
            </h1>
            <p className="text-sm text-muted-foreground">
              Ajuste de DPI do sistema
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 mb-6 flex gap-3">
          <AlertTriangle size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            DPI é ajuste do sistema e costuma existir apenas no Android. Use com cuidado e pesquise como alterar no seu aparelho.
          </p>
        </div>

        {/* Brand Selection */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-3 block">Marca do aparelho:</label>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedBrand === brand.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Model Input */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">Modelo (opcional):</label>
          <input
            type="text"
            value={customModel}
            onChange={(e) => setCustomModel(e.target.value)}
            placeholder="Ex: Redmi Note 12, Moto G..."
            className="input-eclipse"
          />
        </div>

        {/* Profile Selection */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-3 block">Perfil do aparelho:</label>
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <button
                key={profile}
                onClick={() => setSelectedProfile(profile)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedProfile === profile
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {profile}
              </button>
            ))}
          </div>
        </div>

        {/* Objective Selection */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Objetivo:</label>
          <div className="flex flex-wrap gap-2">
            {objectives.map((objective) => (
              <button
                key={objective}
                onClick={() => setSelectedObjective(objective)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedObjective === objective
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {objective}
              </button>
            ))}
          </div>
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
              Gerar DPI
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="glass-card p-4 rounded-2xl animate-fade-in">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-primary">
                DPI Recomendado
              </h3>
              <p className="text-sm text-muted-foreground">
                {result.brand} - {result.model}
              </p>
            </div>

            <div className="text-center py-6 bg-foreground/5 rounded-xl mb-4">
              <p className="text-muted-foreground text-sm mb-2">DPI</p>
              <span className="font-display text-5xl font-bold text-primary">{result.dpi}</span>
            </div>

            <div className="space-y-0 border border-border/30 rounded-xl overflow-hidden mb-4">
              <div className="flex items-center justify-between p-3 bg-foreground/5">
                <span className="text-foreground">Perfil</span>
                <span className="text-primary font-medium">{result.profile}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-foreground">Objetivo</span>
                <span className="text-primary font-medium">{result.objective}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-foreground/5">
                <span className="text-foreground">Resolução Sugerida</span>
                <span className="text-primary font-medium">{result.resolution}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-foreground">Touch Sampling</span>
                <span className="text-primary font-medium">{result.touchSampling}</span>
              </div>
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

export default DpiAndroid;
