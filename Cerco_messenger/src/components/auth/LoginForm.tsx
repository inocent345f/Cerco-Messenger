//----------------------------------Importations--------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/utils/api";

//--------------------------------------------------------------------------------------------------

const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser({
        username: formData.identifier,
        password: formData.password,
      });

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("accessToken", response.access_token);
      
      navigate("/");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur l'application",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Identifiant ou mot de passe incorrect",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
        <img 
            src="/lovable-uploads/283a273b-d013-414a-96a8-cf46bce6668a.png" 
            alt="Cerco Messenger" 
            className="h-12 w-12"
          />
        </div>
        <h2 className="text-3xl font-bold">Bienvenue</h2>
        <p className="text-muted-foreground">
          Connectez-vous pour accéder à votre compte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            id="identifier"
            placeholder="Email ou identifiant"
            type="text"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
            required
          />
          <Input
            id="password"
            placeholder="Mot de passe"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Vous n'avez pas de compte ?{" "}
          <Button variant="link" className="p-0" onClick={onToggle}>
            S'inscrire
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;