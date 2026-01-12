import eclipseLogo from "@/assets/eclipse-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative px-4 pt-8 pb-6">
      {/* Eclipse Glow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-eclipse-radial opacity-30" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-4 float">
          <div className="absolute inset-0 rounded-full bg-foreground/10 blur-3xl scale-150" />
          <img 
            src={eclipseLogo} 
            alt="Eclipse V9" 
            className="relative w-48 h-auto drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-eclipse-gradient text-center mb-2">
          ECLIPSE V9
        </h1>
        
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          Sensi & Performance para Free Fire
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground">10+</p>
            <p className="text-xs text-muted-foreground">Famosos</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground">50K+</p>
            <p className="text-xs text-muted-foreground">Usuários</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground">99%</p>
            <p className="text-xs text-muted-foreground">Precisão</p>
          </div>
        </div>
      </div>
    </section>
  );
};
