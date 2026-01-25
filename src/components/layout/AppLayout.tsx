import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background stars-bg">
      {/* Desktop Sidebar - hidden on mobile/tablet */}
      <DesktopSidebar />
      
      {/* Main content - offset on desktop for sidebar */}
      <main className="pb-24 pt-safe lg:pb-8 lg:pl-64 lg:pt-8">
        <div className="lg:max-w-4xl lg:mx-auto lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Bottom nav - hidden on desktop */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};
