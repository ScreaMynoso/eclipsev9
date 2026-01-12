import { useState, useRef, useCallback, useEffect } from "react";
import { Crosshair, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalibrationResult {
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  consistency: number;
  grade: "S" | "A" | "B" | "C" | "D";
}

export const TouchCalibrator = () => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const [result, setResult] = useState<CalibrationResult | null>(null);
  const [countdown, setCountdown] = useState(0);
  const targetRef = useRef<HTMLDivElement>(null);

  const REQUIRED_TAPS = 20;
  const TEST_DURATION = 10; // seconds

  const startCalibration = () => {
    setIsCalibrating(false);
    setTaps([]);
    setLastTapTime(null);
    setResult(null);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isCalibrating && taps.length === 0 && !result) {
      if (lastTapTime === null && countdown === 0) {
        // Don't start automatically, wait for first tap
      }
    }
  }, [countdown, isCalibrating, taps.length, result, lastTapTime]);

  const handleTap = useCallback(() => {
    if (countdown > 0) return;
    
    const now = performance.now();
    
    if (!isCalibrating) {
      setIsCalibrating(true);
      setLastTapTime(now);
      return;
    }

    if (lastTapTime) {
      const responseTime = now - lastTapTime;
      const newTaps = [...taps, responseTime];
      setTaps(newTaps);

      if (newTaps.length >= REQUIRED_TAPS) {
        calculateResult(newTaps);
        setIsCalibrating(false);
      }
    }
    setLastTapTime(now);
  }, [countdown, isCalibrating, lastTapTime, taps]);

  const calculateResult = (tapTimes: number[]) => {
    const avg = tapTimes.reduce((a, b) => a + b, 0) / tapTimes.length;
    const min = Math.min(...tapTimes);
    const max = Math.max(...tapTimes);
    const variance = tapTimes.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / tapTimes.length;
    const consistency = Math.max(0, 100 - Math.sqrt(variance) / 2);

    let grade: CalibrationResult["grade"] = "D";
    if (avg < 100 && consistency > 80) grade = "S";
    else if (avg < 150 && consistency > 70) grade = "A";
    else if (avg < 200 && consistency > 60) grade = "B";
    else if (avg < 300 && consistency > 50) grade = "C";

    setResult({
      averageResponseTime: Math.round(avg),
      minResponseTime: Math.round(min),
      maxResponseTime: Math.round(max),
      consistency: Math.round(consistency),
      grade,
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S": return "text-yellow-400";
      case "A": return "text-green-400";
      case "B": return "text-blue-400";
      case "C": return "text-orange-400";
      default: return "text-red-400";
    }
  };

  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <Crosshair size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Calibrador de Tela</h3>
          <p className="text-xs text-muted-foreground">Melhore a precisão do toque</p>
        </div>
      </div>

      {!isCalibrating && !result && countdown === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Toque rapidamente na área alvo {REQUIRED_TAPS} vezes para calibrar seu sensor de toque.
          </p>
          <Button onClick={startCalibration} className="w-full">
            <Crosshair size={16} className="mr-2" />
            Iniciar Calibração
          </Button>
        </div>
      )}

      {countdown > 0 && (
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-foreground animate-pulse">{countdown}</div>
          <p className="text-sm text-muted-foreground mt-2">Prepare-se...</p>
        </div>
      )}

      {(isCalibrating || (countdown === 0 && !result && taps.length === 0)) && countdown === 0 && (
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Toques: {taps.length}/{REQUIRED_TAPS}</span>
            <span>{isCalibrating ? "Toque rápido!" : "Toque para começar"}</span>
          </div>
          
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-foreground rounded-full transition-all duration-100"
              style={{ width: `${(taps.length / REQUIRED_TAPS) * 100}%` }}
            />
          </div>

          <div
            ref={targetRef}
            onClick={handleTap}
            className={`w-full h-32 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
              isCalibrating 
                ? "bg-green-500/20 border-2 border-green-500" 
                : "bg-foreground/10 border-2 border-dashed border-foreground/30"
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <Crosshair size={40} className={isCalibrating ? "text-green-400 animate-pulse" : "text-muted-foreground"} />
              <p className="text-xs mt-2 text-muted-foreground">
                {isCalibrating ? "TOQUE AQUI RÁPIDO!" : "Toque para iniciar"}
              </p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className={`text-5xl font-bold ${getGradeColor(result.grade)}`}>
              {result.grade}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Nota do Sensor</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 p-3 rounded-xl text-center">
              <p className="text-2xl font-bold text-foreground">{result.averageResponseTime}ms</p>
              <p className="text-xs text-muted-foreground">Tempo Médio</p>
            </div>
            <div className="bg-secondary/50 p-3 rounded-xl text-center">
              <p className="text-2xl font-bold text-foreground">{result.consistency}%</p>
              <p className="text-xs text-muted-foreground">Consistência</p>
            </div>
            <div className="bg-secondary/50 p-3 rounded-xl text-center">
              <p className="text-lg font-bold text-green-400">{result.minResponseTime}ms</p>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
            <div className="bg-secondary/50 p-3 rounded-xl text-center">
              <p className="text-lg font-bold text-red-400">{result.maxResponseTime}ms</p>
              <p className="text-xs text-muted-foreground">Máximo</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-xl">
            <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {result.grade === "S" || result.grade === "A" 
                ? "Seu sensor está excelente! Você tem vantagem em cliques rápidos."
                : result.grade === "B"
                ? "Sensor bom. Pratique mais para melhorar a consistência."
                : "Seu sensor precisa de calibração. Limpe a tela e tente novamente."}
            </p>
          </div>

          <Button onClick={startCalibration} variant="outline" className="w-full">
            <RotateCcw size={16} className="mr-2" />
            Recalibrar
          </Button>
        </div>
      )}
    </div>
  );
};
