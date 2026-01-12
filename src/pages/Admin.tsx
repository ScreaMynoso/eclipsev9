import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users, Key, Plus, Trash2, Edit, Save, X, Copy, Check, UserCog, Crown, KeyRound, UserX } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Player {
  id: string;
  name: string;
  image_url: string | null;
  sensi_geral: number;
  red_dot: number;
  mira_2x: number;
  mira_4x: number;
  awm_sniper: number;
  olhadinha: number;
  is_active: boolean;
}

interface LicenseKey {
  id: string;
  key: string;
  plan: "basic" | "premium" | "black";
  is_used: boolean;
  used_by: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  plan: "basic" | "premium" | "black" | null;
  key_activated: boolean | null;
  last_ip: string | null;
  created_at: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"players" | "keys" | "users">("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newKeysCount, setNewKeysCount] = useState(1);
  const [newKeysPlan, setNewKeysPlan] = useState<"basic" | "premium" | "black">("basic");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPlayers();
      fetchKeys();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from("famous_players")
      .select("*")
      .order("name");
    if (data) setPlayers(data);
    setIsLoading(false);
  };

  const fetchKeys = async () => {
    const { data } = await supabase
      .from("license_keys")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setKeys(data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data as UserProfile[]);
  };

  const savePlayer = async () => {
    if (!editingPlayer) return;

    const { error } = await supabase
      .from("famous_players")
      .update({
        name: editingPlayer.name,
        sensi_geral: editingPlayer.sensi_geral,
        red_dot: editingPlayer.red_dot,
        mira_2x: editingPlayer.mira_2x,
        mira_4x: editingPlayer.mira_4x,
        awm_sniper: editingPlayer.awm_sniper,
        olhadinha: editingPlayer.olhadinha,
        is_active: editingPlayer.is_active,
      })
      .eq("id", editingPlayer.id);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Salvo!", description: "Jogador atualizado com sucesso" });
      setEditingPlayer(null);
      fetchPlayers();
    }
  };

  const updateUserPlan = async (userId: string, newPlan: "basic" | "premium" | "black") => {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        plan: newPlan,
        key_activated: true
      })
      .eq("id", userId);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plano atualizado!", description: `Usuário agora tem plano ${newPlan.toUpperCase()}` });
      setEditingUser(null);
      fetchUsers();
    }
  };

  const removeUserKey = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        plan: "basic",
        key_activated: false,
        activated_key_id: null
      })
      .eq("id", userId);

    if (error) {
      toast({ title: "Erro ao remover key", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Key removida!", description: "Plano do usuário resetado para Basic" });
      fetchUsers();
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { userId }
      });

      if (error) {
        toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
        return;
      }

      if (data?.error) {
        toast({ title: "Erro ao excluir", description: data.error, variant: "destructive" });
        return;
      }

      toast({ title: "Usuário excluído!", description: "Conta removida com sucesso" });
      fetchUsers();
    } catch (err) {
      toast({ title: "Erro ao excluir", description: "Erro inesperado", variant: "destructive" });
    }
  };

  const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const keyLength = 16;
    
    // Use cryptographically secure random values
    const randomBytes = new Uint8Array(keyLength);
    crypto.getRandomValues(randomBytes);
    
    let key = "";
    for (let i = 0; i < keyLength; i++) {
      if (i > 0 && i % 4 === 0) key += "-";
      // Use modulo to map random byte to character set
      key += chars.charAt(randomBytes[i] % chars.length);
    }
    return key;
  };

  const generateKeys = async () => {
    const newKeys = [];
    for (let i = 0; i < newKeysCount; i++) {
      newKeys.push({
        key: generateKey(),
        plan: newKeysPlan,
      });
    }

    const { error } = await supabase
      .from("license_keys")
      .insert(newKeys);

    if (error) {
      toast({ title: "Erro ao gerar keys", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Keys geradas!", description: `${newKeysCount} keys ${newKeysPlan} criadas` });
      fetchKeys();
    }
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase
      .from("license_keys")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Key deletada!" });
      fetchKeys();
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getPlanBadgeClass = (plan: string | null) => {
    switch (plan) {
      case "black":
        return "bg-purple-500/20 text-purple-400";
      case "premium":
        return "bg-primary/20 text-primary";
      default:
        return "bg-foreground/10 text-muted-foreground";
    }
  };

  if (authLoading || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link 
            to="/"
            className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Painel Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerenciar jogadores, keys e usuários
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("players")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm ${
              activeTab === "players"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10 text-foreground"
            }`}
          >
            <Users size={16} />
            Jogadores
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm ${
              activeTab === "keys"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10 text-foreground"
            }`}
          >
            <Key size={16} />
            Keys
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10 text-foreground"
            }`}
          >
            <UserCog size={16} />
            Usuários
          </button>
        </div>

        {/* Players Tab */}
        {activeTab === "players" && (
          <div className="space-y-4">
            {players.map((player) => (
              <div key={player.id} className="glass-card p-4 rounded-2xl">
                {editingPlayer?.id === player.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingPlayer.name}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                      className="input-eclipse"
                      placeholder="Nome"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "sensi_geral", label: "Geral" },
                        { key: "red_dot", label: "Red Dot" },
                        { key: "mira_2x", label: "Mira 2x" },
                        { key: "mira_4x", label: "Mira 4x" },
                        { key: "awm_sniper", label: "AWM" },
                        { key: "olhadinha", label: "Olhadinha" },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="text-xs text-muted-foreground">{label}</label>
                          <input
                            type="number"
                            value={editingPlayer[key as keyof Player] as number}
                            onChange={(e) => setEditingPlayer({ 
                              ...editingPlayer, 
                              [key]: parseInt(e.target.value) || 0 
                            })}
                            className="input-eclipse text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={savePlayer}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm"
                      >
                        <Save size={16} />
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingPlayer(null)}
                        className="px-4 py-2 rounded-xl bg-foreground/10 text-foreground font-medium text-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Geral: {player.sensi_geral} • Red Dot: {player.red_dot}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingPlayer(player)}
                      className="p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                    >
                      <Edit size={18} className="text-foreground" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === "keys" && (
          <div className="space-y-6">
            {/* Generate Keys */}
            <div className="glass-card p-4 rounded-2xl">
              <h3 className="font-medium text-foreground mb-4">Gerar Novas Keys</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Quantidade</label>
                  <input
                    type="number"
                    value={newKeysCount}
                    onChange={(e) => setNewKeysCount(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={100}
                    className="input-eclipse"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Plano</label>
                  <select
                    value={newKeysPlan}
                    onChange={(e) => setNewKeysPlan(e.target.value as "basic" | "premium" | "black")}
                    className="input-eclipse"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="black">Black</option>
                  </select>
                </div>
              </div>
              <button
                onClick={generateKeys}
                className="btn-eclipse w-full flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Gerar {newKeysCount} Key{newKeysCount > 1 ? "s" : ""}
              </button>
            </div>

            {/* Keys List */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Keys Geradas ({keys.length})</h3>
              {keys.map((key) => (
                <div 
                  key={key.id} 
                  className={`glass-card p-3 rounded-xl ${key.is_used ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground truncate">
                          {key.key}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          key.plan === "black" 
                            ? "bg-purple-500/20 text-purple-400"
                            : key.plan === "premium"
                            ? "bg-primary/20 text-primary"
                            : "bg-foreground/10 text-muted-foreground"
                        }`}>
                          {key.plan}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {key.is_used ? "Usada" : "Disponível"} • {new Date(key.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyKey(key.key)}
                        className="p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                      >
                        {copiedKey === key.key ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-foreground" />
                        )}
                      </button>
                      {!key.is_used && (
                        <button
                          onClick={() => deleteKey(key.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">Usuários Cadastrados ({users.length})</h3>
            </div>
            
            {users.map((userProfile) => (
              <div key={userProfile.id} className="glass-card p-4 rounded-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {userProfile.display_name || "Sem nome"}
                      </h3>
                      {userProfile.key_activated && userProfile.plan && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPlanBadgeClass(userProfile.plan)}`}>
                          {userProfile.plan.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {userProfile.email}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span>IP: {userProfile.last_ip || "N/A"}</span>
                      <span>Cadastro: {new Date(userProfile.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingUser(editingUser === userProfile.id ? null : userProfile.id)}
                      className="p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                      title="Alterar plano"
                    >
                      <Crown size={18} className="text-foreground" />
                    </button>
                    
                    {userProfile.key_activated && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 transition-colors"
                            title="Remover key"
                          >
                            <KeyRound size={18} className="text-orange-400" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Key do Usuário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Isso irá remover a key ativada e resetar o plano para Basic. 
                              O usuário precisará ativar uma nova key para ter acesso premium.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => removeUserKey(userProfile.id)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Remover Key
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                          title="Excluir conta"
                        >
                          <UserX size={18} className="text-red-400" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Conta</AlertDialogTitle>
                          <AlertDialogDescription>
                            <span className="font-semibold text-red-400">ATENÇÃO:</span> Esta ação é irreversível! 
                            A conta de <span className="font-semibold">{userProfile.email}</span> será 
                            permanentemente excluída junto com todos os dados associados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteUser(userProfile.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir Conta
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Edit Plan Section */}
                {editingUser === userProfile.id && (
                  <div className="mt-4 pt-4 border-t border-foreground/10">
                    <p className="text-sm text-muted-foreground mb-3">Alterar plano do usuário:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["basic", "premium", "black"] as const).map((plan) => (
                        <button
                          key={plan}
                          onClick={() => updateUserPlan(userProfile.id, plan)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            userProfile.plan === plan
                              ? plan === "black"
                                ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                                : plan === "premium"
                                ? "bg-primary/30 text-primary border border-primary/50"
                                : "bg-foreground/20 text-foreground border border-foreground/30"
                              : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                          }`}
                        >
                          {plan.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário cadastrado
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Admin;
