import { ArrowLeft, Bell, Moon, Globe, Volume2, Sun } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const { 
    darkMode, 
    setDarkMode, 
    notifications, 
    setNotifications, 
    sounds, 
    setSounds,
    playSound 
  } = useSettings();

  const handleNotificationsChange = (value: boolean) => {
    setNotifications(value);
    if (sounds) playSound("click");
    toast({
      title: value ? "Notificações ativadas" : "Notificações desativadas",
      description: value 
        ? "Você receberá alertas e atualizações" 
        : "Você não receberá mais notificações",
    });
  };

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
    if (sounds) playSound("click");
    toast({
      title: value ? "Tema escuro ativado" : "Tema claro ativado",
      description: value 
        ? "O app está usando o tema escuro" 
        : "O app está usando o tema claro",
    });
  };

  const handleSoundsChange = (value: boolean) => {
    setSounds(value);
    if (value) {
      // Play sound after enabling
      setTimeout(() => playSound("success"), 100);
    }
    toast({
      title: value ? "Sons ativados" : "Sons desativados",
      description: value 
        ? "Efeitos sonoros do app ativados" 
        : "O app está no modo silencioso",
    });
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/perfil"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-display text-xl font-bold text-foreground">
            Configurações
          </h1>
        </div>

        {/* Config Items */}
        <div className="space-y-3">
          {/* Notifications */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 neon-border">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
              <Bell size={20} className="text-foreground" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm">Notificações</h3>
              <p className="text-xs text-muted-foreground">Receber alertas e atualizações</p>
            </div>
            
            <Switch 
              checked={notifications} 
              onCheckedChange={handleNotificationsChange}
            />
          </div>

          {/* Dark Mode */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 neon-border">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
              {darkMode ? (
                <Moon size={20} className="text-foreground" />
              ) : (
                <Sun size={20} className="text-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm">Tema Escuro</h3>
              <p className="text-xs text-muted-foreground">
                {darkMode ? "Usando tema escuro" : "Usando tema claro"}
              </p>
            </div>
            
            <Switch 
              checked={darkMode} 
              onCheckedChange={handleDarkModeChange}
            />
          </div>

          {/* Sounds */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 neon-border">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
              <Volume2 size={20} className="text-foreground" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm">Sons</h3>
              <p className="text-xs text-muted-foreground">Efeitos sonoros do app</p>
            </div>
            
            <Switch 
              checked={sounds} 
              onCheckedChange={handleSoundsChange}
            />
          </div>
        </div>

        {/* Language Section */}
        <div className="mt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Idioma</h2>
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 neon-border">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
              <Globe size={20} className="text-foreground" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm">Idioma do App</h3>
              <p className="text-xs text-muted-foreground">Português (Brasil)</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          As configurações são salvas automaticamente
        </p>
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
