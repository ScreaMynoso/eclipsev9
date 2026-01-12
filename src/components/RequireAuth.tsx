import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  requireKeyActivation?: boolean;
}

export const RequireAuth = ({ children, requireKeyActivation = true }: RequireAuthProps) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (requireKeyActivation && profile && !profile.key_activated) {
        navigate("/ativar-key");
      }
    }
  }, [user, profile, isLoading, navigate, requireKeyActivation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireKeyActivation && profile && !profile.key_activated) {
    return null;
  }

  return <>{children}</>;
};
