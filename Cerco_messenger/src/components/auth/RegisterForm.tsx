import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/utils/api";

const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit comporter au moins 6 caractères.",
      });
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast({
        title: "Inscription réussie",
        description: "Un code OTP vous a été envoyé.",
      });
      // Ouvrir le dialogue OTP (si applicable)
    } catch (error) {
      if (error?.response?.status === 409) {
        const errorMessage = error?.response?.data?.detail;

        if (errorMessage === "L'identifiant est déjà utilisé.") {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "L'identifiant est déjà utilisé. Veuillez choisir un autre identifiant.",
          });
        } else if (errorMessage === "L'email est déjà utilisé.") {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "L'email est déjà utilisé. Veuillez en utiliser un autre.",
          });
        } else if (errorMessage === "L'identifiant et l'email sont déjà utilisés.") {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "L'identifiant et l'email sont déjà utilisés. Veuillez en utiliser un autre.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur inattendue",
            description: "Une erreur inattendue est survenue. Vérifiez votre connexion et réessayez.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur inconnue est survenue. Veuillez réessayer.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          id="username"
          placeholder="Identifiant"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
        <Input
          id="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
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
        <Input
          id="confirmPassword"
          placeholder="Confirmer le mot de passe"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Button variant="link" className="p-0 text-primary" onClick={onToggle}>
            Se connecter
          </Button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
