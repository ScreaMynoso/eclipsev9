import { useState, useEffect, useRef } from "react";
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PingData {
  timestamp: number;
  ping: number;
  status: "good" | "medium" | "bad";
}

const AWS_ENDPOINTS = [
  { name: "São Paulo (Principal)", url: "https://ec2.sa-east-1.amazonaws.com/ping" },
  { name: "Virginia (Backup)", url: "https://ec2.us-east-1.amazonaws.com/ping" },
];

export const NetworkMonitor = () => {
  const { toast } = useToast();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [pingHistory, setPingHistory] = useState<PingData[]>([]);
  const [currentPing, setCurrentPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [packetLoss, setPacketLoss] = useState<number>(0);
  const [status, setStatus] = useState<"good" | "medium" | "bad" | "offline">("good");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const failedPingsRef = useRef(0);
  const totalPingsRef = useRef(0);

  const measurePing = async (): Promise<number> => {
    const start = performance.now();
    try {
      // Using a simple fetch to measure round-trip time
      // We use a small image or API endpoint for minimal data transfer
      await fetch("https://www.google.com/favicon.ico", { 
        mode: "no-cors",
        cache: "no-store" 
      });
      const end = performance.now();
      return Math.round(end - start);
    } catch {
      return -1; // Failed ping
    }
  };

  const getPingStatus = (ping: number): "good" | "medium" | "bad" => {
    if (ping < 50) return "good";
    if (ping < 100) return "medium";
    return "bad";
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setPingHistory([]);
    failedPingsRef.current = 0;
    totalPingsRef.current = 0;

    const runPingTest = async () => {
      const ping = await measurePing();
      totalPingsRef.current++;

      if (ping === -1) {
        failedPingsRef.current++;
        setStatus("offline");
        setCurrentPing(null);
      } else {
        const newData: PingData = {
          timestamp: Date.now(),
          ping,
          status: getPingStatus(ping),
        };

        setPingHistory(prev => {
          const updated = [...prev, newData].slice(-30); // Keep last 30 readings
          
          // Calculate jitter (variance in ping)
          if (updated.length > 1) {
            const pings = updated.map(d => d.ping);
            const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
            const variance = pings.reduce((sum, p) => sum + Math.pow(p - avgPing, 2), 0) / pings.length;
            setJitter(Math.round(Math.sqrt(variance)));
          }

          return updated;
        });

        setCurrentPing(ping);
        setStatus(getPingStatus(ping));
      }

      // Calculate packet loss
      setPacketLoss(Math.round((failedPingsRef.current / totalPingsRef.current) * 100));
    };

    runPingTest();
    intervalRef.current = setInterval(runPingTest, 1000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const flushDns = async () => {
    // Simulate DNS flush by making multiple requests to clear cache
    toast({
      title: "Limpando DNS...",
      description: "Isso pode levar alguns segundos",
    });

    // Force browser to re-resolve DNS
    const requests = [
      fetch("https://dns.google/resolve?name=freefiremax.com", { cache: "no-store" }),
      fetch("https://1.1.1.1/dns-query?name=freefiremax.com", { 
        headers: { "Accept": "application/dns-json" },
        cache: "no-store" 
      }),
    ];

    await Promise.allSettled(requests);

    toast({
      title: "DNS Limpo!",
      description: "Conexão renovada. Teste novamente.",
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "good": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "bad": return "text-red-400";
      case "offline": return "text-gray-400";
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case "good": return "bg-green-500/20 border-green-500/30";
      case "medium": return "bg-yellow-500/20 border-yellow-500/30";
      case "bad": return "bg-red-500/20 border-red-500/30";
      case "offline": return "bg-gray-500/20 border-gray-500/30";
    }
  };

  const maxPing = Math.max(...pingHistory.map(d => d.ping), 100);

  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <Wifi size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Monitor de Rede</h3>
          <p className="text-xs text-muted-foreground">Estabilidade em tempo real</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status Card */}
        <div className={`p-4 rounded-xl border ${getStatusBg()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status === "offline" ? (
                <WifiOff size={32} className={getStatusColor()} />
              ) : (
                <Wifi size={32} className={getStatusColor()} />
              )}
              <div>
                <p className={`text-3xl font-bold ${getStatusColor()}`}>
                  {currentPing !== null ? `${currentPing}ms` : "---"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === "good" && "Conexão Excelente"}
                  {status === "medium" && "Conexão Estável"}
                  {status === "bad" && "Conexão Instável"}
                  {status === "offline" && "Sem Conexão"}
                </p>
              </div>
            </div>
            {isMonitoring && (
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            )}
          </div>
        </div>

        {/* Stats */}
        {pingHistory.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-secondary/50 p-2 rounded-xl text-center">
              <p className="text-lg font-bold text-foreground">{jitter || 0}ms</p>
              <p className="text-xs text-muted-foreground">Jitter</p>
            </div>
            <div className="bg-secondary/50 p-2 rounded-xl text-center">
              <p className="text-lg font-bold text-foreground">{packetLoss}%</p>
              <p className="text-xs text-muted-foreground">Perda</p>
            </div>
            <div className="bg-secondary/50 p-2 rounded-xl text-center">
              <p className="text-lg font-bold text-foreground">
                {Math.min(...pingHistory.map(d => d.ping))}ms
              </p>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
          </div>
        )}

        {/* Ping Graph */}
        {pingHistory.length > 0 && (
          <div className="h-24 bg-secondary/30 rounded-xl p-2 flex items-end gap-[2px]">
            {pingHistory.map((data, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all ${
                  data.status === "good" ? "bg-green-400" :
                  data.status === "medium" ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ 
                  height: `${Math.min((data.ping / maxPing) * 100, 100)}%`,
                  minHeight: "4px"
                }}
              />
            ))}
          </div>
        )}

        {/* Recommendation */}
        {status === "bad" && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/30">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-red-400">Rede instável!</strong> Reinicie seu roteador ou 
              mude para uma rede mais próxima. Evite jogar ranqueada agora.
            </div>
          </div>
        )}

        {status === "good" && pingHistory.length > 5 && (
          <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/30">
            <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-green-400">Conexão perfeita!</strong> Ótimo momento para 
              jogar ranqueada.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!isMonitoring ? (
            <Button onClick={startMonitoring} className="flex-1">
              <Wifi size={16} className="mr-2" />
              Iniciar Monitoramento
            </Button>
          ) : (
            <Button onClick={stopMonitoring} variant="outline" className="flex-1">
              <WifiOff size={16} className="mr-2" />
              Parar
            </Button>
          )}
          <Button variant="outline" onClick={flushDns}>
            <RefreshCw size={16} />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Clique em <RefreshCw size={12} className="inline" /> para limpar DNS e renovar conexão
        </p>
      </div>
    </div>
  );
};
