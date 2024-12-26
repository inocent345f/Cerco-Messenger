import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Volume2,
  Languages,
  Trash2,
  Info,
} from "lucide-react";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsCard } from "@/components/settings/SettingsCard";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [language, setLanguage] = useState("Français");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
    toast({
      title: "Thème modifié",
      description: `Le thème ${isDarkMode ? "clair" : "sombre"} a été activé`,
    });
  };

  const handleDeleteAccount = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { id } = JSON.parse(userData);
      localStorage.removeItem(`user_${id}`);
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(`chat_${id}_`) || key.includes(`_${id}`)) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
        variant: "destructive",
      });
      navigate("/auth");
    }
  };

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos modifications ont été enregistrées avec succès",
    });
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="container max-w-2xl mx-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
        <SettingsHeader />

        <div className="space-y-8">
          <SettingsSection title="Apparence" className="animate-fade-in">
            <SettingsCard 
              icon={isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} 
              title="Thème"
            >
              <div className="flex items-center justify-between mt-2 group">
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Thème {isDarkMode ? "sombre" : "clair"}
                </span>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={toggleTheme}
                  className="transition-transform hover:scale-105"
                />
              </div>
            </SettingsCard>
          </SettingsSection>

          <Separator className="bg-border/50" />

          <SettingsSection title="Notifications" className="animate-fade-in delay-100">
            <TooltipProvider>
              <SettingsCard icon={<Bell className="h-5 w-5" />} title="Notifications push">
                <div className="flex items-center justify-between mt-2 group">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Activer les notifications
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Recevez des notifications pour les nouveaux messages
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                    className="transition-transform hover:scale-105"
                  />
                </div>
              </SettingsCard>
              
              <SettingsCard icon={<Volume2 className="h-5 w-5" />} title="Sons">
                <div className="flex items-center justify-between mt-2 group">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Activer les sons
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Sons de notification et effets sonores
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch 
                    checked={sound} 
                    onCheckedChange={setSound}
                    className="transition-transform hover:scale-105"
                  />
                </div>
              </SettingsCard>
            </TooltipProvider>
          </SettingsSection>

          <Separator className="bg-border/50" />

          <SettingsSection title="Langue et région" className="animate-fade-in delay-200">
            <SettingsCard icon={<Languages className="h-5 w-5" />} title="Langue de l'application">
              <select 
                className="w-full mt-2 p-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="Français">Français</option>
                <option value="English">English</option>
                <option value="Español">Español</option>
              </select>
            </SettingsCard>
          </SettingsSection>

          <Separator className="bg-border/50" />

          <SettingsSection title="Sécurité" className="animate-fade-in delay-300">
            <SettingsCard icon={<Shield className="h-5 w-5" />} title="Authentification à deux facteurs">
              <Button 
                variant="outline" 
                className="mt-2 w-full md:w-auto transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
              >
                Configurer
              </Button>
            </SettingsCard>
          </SettingsSection>

          <Separator className="bg-border/50" />

          <SettingsSection title="Appareils connectés" className="animate-fade-in delay-400">
            <SettingsCard 
              icon={<Smartphone className="h-5 w-5" />} 
              title="iPhone 13"
            >
              <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                Dernière connexion: Aujourd'hui
              </p>
            </SettingsCard>
          </SettingsSection>

          <Separator className="bg-border/50" />

          <SettingsSection title="Zone de danger" className="pb-6 animate-fade-in delay-500">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full group hover:bg-destructive/90 transition-all duration-300"
                >
                  <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Supprimer mon compte
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="animate-scale-in">
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsSection>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border md:relative md:border-0 md:bg-transparent md:backdrop-blur-none animate-fade-in">
            <Button 
              onClick={handleSave} 
              className="w-full md:w-auto bg-gradient-to-r from-primary/80 to-primary hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              Sauvegarder les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;