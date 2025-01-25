//--------------------------Importattion--------------------------------
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { registerUser, verifyOtp } from "@/utils/api";
//----------------------------------------------------------------------
const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState(""); // État pour stocker le code OTP
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
      setIsOtpDialogOpen(true); // Ouvre le dialogue OTP
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setIsLoading(true);
      await verifyOtp({
         email: formData.email, 
         token:otp,
         type:"email"}
        );
      toast({
        title: "Vérification réussie",
        description: "Votre compte a été vérifié avec succès.",
      });
      setIsOtpDialogOpen(false); // Ferme le dialogue OTP
      onToggle(); // Redirige vers la connexion
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le code OTP est invalide ou a expiré.",
      });
    } finally {
      setIsLoading(false);
    }
  };
//----------------------------------------views return-------------------------------------------------------
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
        <h2 className="text-3xl font-bold">Inscription</h2>
        <p className="text-muted-foreground">
          Créez votre compte pour commencer
        </p>
      </div>
     
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Button variant="link" className="p-0 text-primary" onClick={onToggle}>
            Se connecter
          </Button>
        </p>
      </div>

      {isOtpDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-sm">
            <h2 className="text-lg font-bold text-center">Vérification OTP</h2>
            <p className="text-sm text-muted-foreground text-center">
              Veuillez entrer le code OTP envoyé à votre adresse email.
            </p>
            <Input
              type="text"
              placeholder="Code OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOtpDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleOtpSubmit}>Confirmer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    
  );
};

export default RegisterForm;
