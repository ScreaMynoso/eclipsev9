import { useState } from "react";
import { FileCode, Copy, Download, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  tier: "premium" | "black";
  config: object;
}

const configTemplates: ConfigTemplate[] = [
  {
    id: "render_boost",
    name: "Render Boost",
    description: "Otimiza renderização para +20 FPS",
    tier: "premium",
    config: {
      version: "1.0",
      render: {
        max_fps: 90,
        vsync: false,
        triple_buffer: false,
        gpu_priority: "high",
        texture_quality: "medium",
        shadow_quality: "off",
        anti_aliasing: "off",
        post_processing: "minimal"
      },
      memory: {
        cache_size: "512mb",
        preload_assets: true,
        aggressive_gc: true
      }
    }
  },
  {
    id: "network_opt",
    name: "Network Optimizer",
    description: "Reduz lag e estabiliza ping",
    tier: "premium",
    config: {
      version: "1.0",
      network: {
        tcp_nodelay: true,
        socket_buffer: "64kb",
        keep_alive: true,
        timeout: 5000,
        retry_count: 3,
        dns_cache: true,
        ipv6: false
      },
      connection: {
        prefer_wifi: true,
        background_data: false,
        sync_interval: 16
      }
    }
  },
  {
    id: "ultra_perf",
    name: "Ultra Performance",
    description: "Configuração extrema para dispositivos potentes",
    tier: "black",
    config: {
      version: "2.0",
      render: {
        max_fps: 120,
        vsync: false,
        triple_buffer: false,
        gpu_priority: "realtime",
        texture_quality: "low",
        shadow_quality: "off",
        anti_aliasing: "off",
        post_processing: "off",
        draw_distance: "medium",
        particle_quality: "low"
      },
      memory: {
        cache_size: "1024mb",
        preload_assets: true,
        aggressive_gc: true,
        compress_textures: true
      },
      cpu: {
        thread_priority: "high",
        affinity: "performance_cores",
        background_limit: true
      },
      touch: {
        sample_rate: 240,
        prediction: true,
        filtering: "minimal"
      }
    }
  },
  {
    id: "pro_player",
    name: "Pro Player Config",
    description: "Usado por jogadores profissionais LBFF",
    tier: "black",
    config: {
      version: "2.0",
      render: {
        max_fps: 90,
        vsync: false,
        gpu_priority: "high",
        texture_quality: "medium",
        shadow_quality: "off",
        effects: "minimal"
      },
      input: {
        touch_sensitivity_multiplier: 1.0,
        aim_assist: "reduced",
        gyro_calibration: true,
        dead_zone: 0.05
      },
      audio: {
        spatial_audio: true,
        footstep_boost: 1.5,
        gunshot_distance: "extended"
      },
      network: {
        packet_priority: "gaming",
        buffer_size: "minimal",
        prediction: true
      }
    }
  }
];

interface MacroConfigGeneratorProps {
  userPlan: "basic" | "premium" | "black" | null;
}

export const MacroConfigGenerator = ({ userPlan }: MacroConfigGeneratorProps) => {
  const { toast } = useToast();
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [generatedConfig, setGeneratedConfig] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const isLocked = (tier: "premium" | "black") => {
    if (!userPlan) return true;
    const planHierarchy = { basic: 1, premium: 2, black: 3 };
    const tierLevel = planHierarchy[tier];
    const userLevel = planHierarchy[userPlan];
    return tierLevel > userLevel;
  };

  const generateConfig = () => {
    const template = configTemplates.find(t => t.id === selectedConfig);
    if (!template) {
      toast({
        title: "Erro",
        description: "Selecione uma configuração",
        variant: "destructive",
      });
      return;
    }

    if (isLocked(template.tier)) {
      toast({
        title: "Bloqueado",
        description: `Esta configuração requer o plano ${template.tier.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }

    const configJson = JSON.stringify(template.config, null, 2);
    setGeneratedConfig(configJson);
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(generatedConfig);
    setCopied(true);
    toast({
      title: "Copiado!",
      description: "Configuração copiada. Cole no ZArchiver.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConfig = () => {
    const template = configTemplates.find(t => t.id === selectedConfig);
    const blob = new Blob([generatedConfig], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eclipse_${template?.id || "config"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Download iniciado",
      description: "Arquivo salvo na pasta Downloads",
    });
  };

  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <FileCode size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Gerador de Config</h3>
          <p className="text-xs text-muted-foreground">Arquivos de otimização prontos</p>
        </div>
      </div>

      <div className="space-y-4">
        <Select value={selectedConfig} onValueChange={setSelectedConfig}>
          <SelectTrigger className="bg-secondary/50">
            <SelectValue placeholder="Selecione uma configuração" />
          </SelectTrigger>
          <SelectContent>
            {configTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  {isLocked(template.tier) && <Lock size={12} className="text-muted-foreground" />}
                  <span>{template.name}</span>
                  <span className={template.tier === "black" ? "badge-black" : "badge-premium"}>
                    {template.tier.toUpperCase()}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedConfig && (
          <div className="p-3 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground">
              {configTemplates.find(t => t.id === selectedConfig)?.description}
            </p>
          </div>
        )}

        <Button 
          onClick={generateConfig} 
          className="w-full"
          disabled={!selectedConfig}
        >
          <FileCode size={16} className="mr-2" />
          Gerar Configuração
        </Button>

        {generatedConfig && (
          <div className="space-y-3">
            <div className="bg-background p-3 rounded-xl font-mono text-xs overflow-x-auto max-h-48 overflow-y-auto border border-border">
              <pre className="text-muted-foreground">{generatedConfig}</pre>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyConfig}>
                {copied ? <CheckCircle size={16} className="mr-2 text-green-400" /> : <Copy size={16} className="mr-2" />}
                Copiar
              </Button>
              <Button variant="outline" className="flex-1" onClick={downloadConfig}>
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>

            <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <p className="text-xs text-muted-foreground">
                <strong className="text-yellow-400">Como usar:</strong> Baixe o ZArchiver, navegue até 
                <code className="mx-1 px-1 bg-secondary rounded">/Android/data/com.dts.freefireth/</code>
                e cole o arquivo de configuração.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
