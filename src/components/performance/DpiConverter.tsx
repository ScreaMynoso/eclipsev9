import { useState } from "react";
import { Calculator, ArrowRight, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ConversionResult {
  newSensitivity: number;
  difference: string;
  recommendation: string;
}

export const DpiConverter = () => {
  const { toast } = useToast();
  const [oldDpi, setOldDpi] = useState("");
  const [oldSensi, setOldSensi] = useState("");
  const [newDpi, setNewDpi] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateNewSensitivity = () => {
    const oldDpiNum = parseFloat(oldDpi);
    const oldSensiNum = parseFloat(oldSensi);
    const newDpiNum = parseFloat(newDpi);

    if (!oldDpiNum || !oldSensiNum || !newDpiNum) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      });
      return;
    }

    // Formula: (Old DPI * Old Sensitivity) / New DPI = New Sensitivity
    const effectiveSensitivity = oldDpiNum * oldSensiNum;
    const newSensitivity = effectiveSensitivity / newDpiNum;
    const roundedNewSensi = Math.round(newSensitivity * 10) / 10;

    const percentChange = ((newSensitivity - oldSensiNum) / oldSensiNum) * 100;

    let recommendation = "";
    if (newDpiNum > oldDpiNum) {
      recommendation = "DPI maior = mais precisão em movimentos pequenos. Ideal para mira refinada.";
    } else if (newDpiNum < oldDpiNum) {
      recommendation = "DPI menor = movimentos mais suaves. Bom para tracking de inimigos.";
    } else {
      recommendation = "Mesma DPI, mesma sensação de jogo.";
    }

    setResult({
      newSensitivity: roundedNewSensi,
      difference: percentChange > 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`,
      recommendation,
    });
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`Nova Sensibilidade: ${result.newSensitivity}`);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Sensibilidade copiada para área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const presetDpis = [220, 280, 320, 400, 450, 500];

  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <Calculator size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Conversor de DPI</h3>
          <p className="text-xs text-muted-foreground">Mantenha sua sensibilidade ao trocar DPI</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">DPI Antiga</Label>
            <Input
              type="number"
              placeholder="Ex: 320"
              value={oldDpi}
              onChange={(e) => setOldDpi(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Sensibilidade Antiga</Label>
            <Input
              type="number"
              placeholder="Ex: 85"
              value={oldSensi}
              onChange={(e) => setOldSensi(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Nova DPI</Label>
          <Input
            type="number"
            placeholder="Ex: 450"
            value={newDpi}
            onChange={(e) => setNewDpi(e.target.value)}
            className="bg-secondary/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Presets:</span>
          {presetDpis.map((dpi) => (
            <button
              key={dpi}
              onClick={() => setNewDpi(String(dpi))}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                newDpi === String(dpi)
                  ? "bg-foreground text-background"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {dpi}
            </button>
          ))}
        </div>

        <Button onClick={calculateNewSensitivity} className="w-full">
          <Calculator size={16} className="mr-2" />
          Calcular Nova Sensibilidade
        </Button>

        {result && (
          <div className="mt-4 space-y-3">
            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Nova Sensibilidade</p>
                  <p className="text-3xl font-bold text-green-400">{result.newSensitivity}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyResult}
                  className="h-10 w-10"
                >
                  {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Diferença:</span>
              <span className={result.difference.startsWith("+") ? "text-red-400" : "text-green-400"}>
                {result.difference}
              </span>
            </div>

            <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-xl">
              <ArrowRight size={16} className="text-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
