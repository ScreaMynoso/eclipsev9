import { Bell, X } from "lucide-react";
import { useState } from "react";

interface AnnouncementBannerProps {
  message: string;
}

export const AnnouncementBanner = ({ message }: AnnouncementBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !message) return null;

  return (
    <div className="mx-4 mt-4 glass-card p-3 rounded-xl animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
          <Bell size={16} className="text-foreground animate-pulse" />
        </div>
        <p className="flex-1 text-sm text-foreground">{message}</p>
        <button 
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-foreground/10 transition-colors"
        >
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
