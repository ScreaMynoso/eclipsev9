import eclipseLogo from "@/assets/eclipse-logo.png";

export const HeroSection = () => {
  return (
    <section className="relative px-4 pt-8 pb-6 lg:px-0 lg:pt-4 lg:pb-8">
      {/* Eclipse Glow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-eclipse-radial opacity-30 lg:w-[500px] lg:h-[500px]" />
      </div>
      
      {/* Mobile/Tablet: centered column | Desktop: row layout */}
      <div className="relative z-10 flex flex-col items-center lg:flex-row lg:items-center lg:gap-8">
        {/* Logo */}
        <div className="relative mb-4 float lg:mb-0 lg:flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-foreground/10 blur-3xl scale-150" />
          <img 
            src={eclipseLogo} 
            alt="Eclipse V9" 
            className="relative w-48 h-auto drop-shadow-2xl lg:w-32"
          />
        </div>

        <div className="flex flex-col items-center lg:items-start lg:flex-1">
          {/* Title */}
          <h1 className="font-display text-3xl font-bold text-eclipse-gradient text-center mb-2 lg:text-left lg:text-4xl lg:hidden">
            ECLIPSE V9
          </h1>
          
          <p className="text-muted-foreground text-center text-sm max-w-xs lg:text-left lg:max-w-md lg:text-base">
            Sensi & Performance para Free Fire
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 lg:mt-4 lg:gap-8">
            <div className="text-center lg:text-left">
              <p className="font-display text-2xl font-bold text-foreground lg:text-3xl">10+</p>
              <p className="text-xs text-muted-foreground lg:text-sm">Famosos</p>
            </div>
            <div className="w-px h-10 bg-border lg:h-12" />
            <div className="text-center lg:text-left">
              <p className="font-display text-2xl font-bold text-foreground lg:text-3xl">50K+</p>
              <p className="text-xs text-muted-foreground lg:text-sm">Usuários</p>
            </div>
            <div className="w-px h-10 bg-border lg:h-12" />
            <div className="text-center lg:text-left">
              <p className="font-display text-2xl font-bold text-foreground lg:text-3xl">99%</p>
              <p className="text-xs text-muted-foreground lg:text-sm">Precisão</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
