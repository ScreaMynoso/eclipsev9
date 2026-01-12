import { useState, useRef } from "react";
import { ArrowLeft, Target, Copy, Heart, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlanLockOverlay } from "@/components/PlanLockOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface SensiResult {
  weapon: string;
  style: string;
  geral: number;
  redDot: number;
  mira2x: number;
  mira4x: number;
  awm: number;
  olhadinha: number;
}

const weapons = [
  { id: "xm8", name: "XM8" },
  { id: "ump", name: "UMP" },
  { id: "desert", name: "Desert" },
  { id: "mp40", name: "MP40" },
  { id: "carapina", name: "Carapina" },
  { id: "m1014", name: "M1014" },
  { id: "12nova", name: "12 Nova" },
  { id: "ac80", name: "AC80" },
];

const styles = ["Controle", "Balanceado", "Rápido"];

const weaponModifiers: Record<string, { base: number; variance: number }> = {
  xm8: { base: 150, variance: 12 },
  ump: { base: 145, variance: 10 },
  desert: { base: 135, variance: 15 },
  mp40: { base: 160, variance: 12 },
  carapina: { base: 125, variance: 8 },
  m1014: { base: 140, variance: 10 },
  "12nova": { base: 138, variance: 10 },
  ac80: { base: 148, variance: 12 },
};

const styleModifiers: Record<string, number> = {
  "Controle": -15,
  "Balanceado": 0,
  "Rápido": 20,
};

const generateSensi = (weapon: string, style: string): Omit<SensiResult, "weapon" | "style"> => {
  const weaponConfig = weaponModifiers[weapon] || { base: 145, variance: 10 };
  const styleModifier = styleModifiers[style] || 0;
  
  const randomInRange = (base: number, variance: number) => 
    Math.floor(base + styleModifier + (Math.random() - 0.5) * variance * 2);

  return {
    geral: randomInRange(weaponConfig.base, weaponConfig.variance),
    redDot: randomInRange(weaponConfig.base + 8, weaponConfig.variance),
    mira2x: randomInRange(weaponConfig.base + 3, weaponConfig.variance),
    mira4x: randomInRange(weaponConfig.base - 10, weaponConfig.variance),
    awm: randomInRange(weaponConfig.base - 25, weaponConfig.variance),
    olhadinha: randomInRange(weaponConfig.base + 5, weaponConfig.variance),
  };
};

const SensiArma = () => {
  const { profile } = useAuth();
  const userPlan = profile?.plan || "basic";
  const isLocked = userPlan === "basic";

  const [selectedWeapon, setSelectedWeapon] = useState("xm8");
  const [selectedStyle, setSelectedStyle] = useState("Balanceado");
  const [result, setResult] = useState<SensiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const sensi = generateSensi(selectedWeapon, selectedStyle);
      setResult({
        weapon: weapons.find(w => w.id === selectedWeapon)?.name || selectedWeapon,
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
    const text = `Sensi por Arma: ${result.weapon}
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
      type: "sensi_arma",
      name: `${result.weapon} - ${result.style}`,
      style: result.style,
      weapon: result.weapon,
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
      {isLocked && <PlanLockOverlay requiredPlan="premium" feature="Sensi por Arma" />}
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
              Sensi por Arma
            </h1>
            <p className="text-sm text-muted-foreground">
              Configuração focada na sua arma
            </p>
          </div>
        </div>

        {/* Weapon Selection */}
        <div className="glass-card p-4 rounded-2xl mb-4">
          <label className="text-sm text-muted-foreground mb-3 block">Qual arma você quer?</label>
          <div className="flex items-center gap-2 p-3 bg-foreground/5 rounded-xl mb-4">
            <Target size={18} className="text-primary" />
            <span className="text-foreground font-medium">
              {weapons.find(w => w.id === selectedWeapon)?.name}
            </span>
          </div>
          
          <label className="text-sm text-muted-foreground mb-3 block">Armas populares:</label>
          <div className="flex flex-wrap gap-2">
            {weapons.map((weapon) => (
              <button
                key={weapon.id}
                onClick={() => setSelectedWeapon(weapon.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedWeapon === weapon.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {weapon.name}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Estilo:</label>
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
              <Target size={18} className="animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Target size={18} />
              Gerar Sensi da Arma
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="glass-card p-4 rounded-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  {result.weapon}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Estilo: {result.style}
                </p>
              </div>
            </div>

            <h4 className="text-primary font-semibold mb-3">Sensibilidade Recomendada</h4>

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

            <p className="text-xs text-center text-muted-foreground mt-4 p-3 bg-primary/10 rounded-lg">
              💡 Se estiver tremendo muito, abaixe o Red Dot em 5-10.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SensiArma;
