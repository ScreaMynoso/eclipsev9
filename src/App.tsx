import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index";
import SensiIA from "./pages/SensiIA";
import Performance from "./pages/Performance";
import Perfil from "./pages/Perfil";
import Famosos from "./pages/Famosos";
import NotFound from "./pages/NotFound";
import SensiFamosos from "./pages/SensiFamosos";
import SensiAleatoria from "./pages/SensiAleatoria";
import SensiArma from "./pages/SensiArma";
import DpiAndroid from "./pages/DpiAndroid";
import CiclosIphone from "./pages/CiclosIphone";
import Favoritos from "./pages/Favoritos";
import Auth from "./pages/Auth";
import AtivarKey from "./pages/AtivarKey";
import Admin from "./pages/Admin";
import Configuracoes from "./pages/Configuracoes";
import Privacidade from "./pages/Privacidade";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import SegurancaConta from "./pages/SegurancaConta";
import DadosPessoais from "./pages/DadosPessoais";
import ConversorSensi from "./pages/ConversorSensi";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/ativar-key" element={<AtivarKey />} />
              
              {/* Protected routes */}
              <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
              <Route path="/sensi-ia" element={<RequireAuth><SensiIA /></RequireAuth>} />
              <Route path="/performance" element={<RequireAuth><Performance /></RequireAuth>} />
              <Route path="/perfil" element={<RequireAuth><Perfil /></RequireAuth>} />
              <Route path="/famosos" element={<RequireAuth><Famosos /></RequireAuth>} />
              <Route path="/sensi-famosos" element={<RequireAuth><SensiFamosos /></RequireAuth>} />
              <Route path="/sensi-aleatoria" element={<RequireAuth><SensiAleatoria /></RequireAuth>} />
              <Route path="/sensi-arma" element={<RequireAuth><SensiArma /></RequireAuth>} />
              <Route path="/dpi-android" element={<RequireAuth><DpiAndroid /></RequireAuth>} />
              <Route path="/ciclos-iphone" element={<RequireAuth><CiclosIphone /></RequireAuth>} />
              <Route path="/conversor-sensi" element={<RequireAuth><ConversorSensi /></RequireAuth>} />
              <Route path="/favoritos" element={<RequireAuth><Favoritos /></RequireAuth>} />
              <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
              <Route path="/configuracoes" element={<RequireAuth><Configuracoes /></RequireAuth>} />
              <Route path="/privacidade" element={<RequireAuth><Privacidade /></RequireAuth>} />
              <Route path="/termos-uso" element={<RequireAuth><TermosUso /></RequireAuth>} />
              <Route path="/politica-privacidade" element={<RequireAuth><PoliticaPrivacidade /></RequireAuth>} />
              <Route path="/seguranca-conta" element={<RequireAuth><SegurancaConta /></RequireAuth>} />
              <Route path="/dados-pessoais" element={<RequireAuth><DadosPessoais /></RequireAuth>} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
