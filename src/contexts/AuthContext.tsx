import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  plan: "basic" | "premium" | "black";
  key_activated: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  activateKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileData) {
      setProfile(profileData as Profile);
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    setIsAdmin(!!roleData);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
  };

  const activateKey = async (key: string) => {
    if (!user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    const formattedKey = key.trim().toUpperCase();

    // Atomic update - prevents race conditions by combining check and update in one operation
    // This ensures only one user can activate a key even if multiple requests happen simultaneously
    const { data: keyData, error: updateKeyError } = await supabase
      .from("license_keys")
      .update({
        is_used: true,
        used_by: user.id,
        used_at: new Date().toISOString(),
      })
      .eq("key", formattedKey)
      .eq("is_used", false)
      .select()
      .single();

    // If no data returned, the key was invalid, already used, or doesn't exist
    if (updateKeyError || !keyData) {
      return { success: false, error: "Key inválida ou já utilizada" };
    }

    // Check expiration after atomic update (if expired, we need to rollback)
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      // Rollback the key activation since it's expired
      await supabase
        .from("license_keys")
        .update({
          is_used: false,
          used_by: null,
          used_at: null,
        })
        .eq("id", keyData.id);
      
      return { success: false, error: "Key expirada" };
    }

    // Update user profile
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        plan: keyData.plan,
        key_activated: true,
        activated_key_id: keyData.id,
      })
      .eq("id", user.id);

    if (updateProfileError) {
      // Rollback key activation if profile update fails
      await supabase
        .from("license_keys")
        .update({
          is_used: false,
          used_by: null,
          used_at: null,
        })
        .eq("id", keyData.id);
      
      return { success: false, error: "Erro ao atualizar perfil" };
    }

    await refreshProfile();
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        signUp,
        signIn,
        signOut,
        activateKey,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
