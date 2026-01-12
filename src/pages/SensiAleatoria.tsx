import { useState, useRef } from "react";
import { ArrowLeft, Sparkles, Copy, Heart, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "@/hooks/use-toast";

interface SensiResult {
  style: string;
  geral: number;
  redDot: number;
  mira2x: number;
  mira4x: number;
  awm: number;
  olhadinha: number;
}

const styles = ["Balanceada", "Mais capa", "Mais controle", "Muito rápida"];

const generateSensi = (style: string): Omit<SensiResult, "style"> => {
  const baseValues = {
    "Balanceada": { base: 145, variance: 12 },
    "Mais capa": { base: 165, variance: 18 },
    "Mais controle": { base: 125, variance: 10 },
    "Muito rápida": { base: 180, variance: 25 },
  };
  
  const config = baseValues[style as keyof typeof baseValues] || baseValues["Balanceada"];
  const randomInRange = (base: number, variance: number) => 
    Math.floor(base + (Math.random() - 0.5) * variance * 2);

  return {
    geral: randomInRange(config.base, config.variance),
    redDot: randomInRange(config.base + 5, config.variance),
    mira2x: randomInRange(config.base - 5, config.variance),
    mira4x: randomInRange(config.base - 20, config.variance),
    awm: randomInRange(config.base - 30, config.variance),
    olhadinha: randomInRange(config.base + 10, config.variance),
  };
};

const SensiAleatoria = () => {
  const [selectedStyle, setSelectedStyle] = useState("Balanceada");
  const [result, setResult] = useState<SensiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const sensi = generateSensi(selectedStyle);
      setResult({
        style: selectedStyle,
        ...sensi,
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
    const text = `Sensibilidade Gerada
Estilo: ${result.style}
Geral: ${result.geral}
Red Dot: ${result.redDot}
Mira 2x: ${result.mira2x}
Mira 4x: ${result.mira4x}
AWM/Sniper: ${result.awm}
Olhadinha: ${result.olhadinha}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Tudo copiado!", description: "Sensibilidade copiada para a área de transferência" });
  };

  const saveFavorite = () => {
    if (!result) return;
    const favorites = JSON.parse(localStorage.getItem("eclipse_favorites") || "[]");
    const newFavorite = {
      id: Date.now().toString(),
      type: "sensi_aleatoria",
      name: `Sensi ${result.style}`,
      style: result.style,
      data: result,
      createdAt: new Date().toISOString(),
    };
    favorites.push(newFavorite);
    localStorage.setItem("eclipse_favorites", JSON.stringify(favorites));
    toast({ title: "Salvo!", description: "Adicionado aos favoritos" });
  };

  const sensiFields = result ? [
    { label: "Geral", value: result.geral },
    { label: "Red Dot", value: result.redDot },
    { label: "Mira 2x", value: result.mira2x },
    { label: "Mira 4x", value: result.mira4x },
    { label: "AWM / Sniper", value: result.awm },
    { label: "Olhadinha", value: result.olhadinha },
  ] : [];

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
              Sensi Aleatória
            </h1>
            <p className="text-sm text-muted-foreground">
              Crie sua configuração personalizada
            </p>
          </div>
        </div>

        {/* Style Selection */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Selecione o estilo:</label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStyle === style
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {style}
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
              <Sparkles size={18} className="animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Gerar Sensi
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="glass-card p-4 rounded-2xl animate-fade-in">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-primary">
                Sensibilidade Gerada
              </h3>
              <p className="text-sm text-muted-foreground">
                Estilo: {result.style}
              </p>
            </div>

            <div className="space-y-0 border border-border/30 rounded-xl overflow-hidden">
              {sensiFields.map((field, index) => (
                <div
                  key={field.label}
                  className={`flex items-center justify-between p-3 ${
                    index % 2 === 0 ? "bg-foreground/5" : "bg-transparent"
                  }`}
                >
                  <span className="text-foreground">{field.label}</span>
                  <span className="text-primary font-bold text-lg">{field.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
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

export default SensiAleatoria;
