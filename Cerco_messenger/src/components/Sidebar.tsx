import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Bookmark,
  Settings,
  Sun,
  Moon,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDark = document.documentElement.classList.contains("dark");

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
    toast({
      title: "Thème modifié",
      description: `Le thème ${isDark ? "clair" : "sombre"} a été activé`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/auth");
  };

  return (
    <div className="w-16 md:w-64 h-full border-r border-border bg-sidebar-background flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold hidden md:block text-sidebar-foreground">Chat App</h1>
      </div>
      
      <div className="flex-1 px-2 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/")}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden md:inline">Messages</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/contacts")}
        >
          <Users className="h-5 w-5" />
          <span className="hidden md:inline">Contacts</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/saved-messages")}
        >
          <Bookmark className="h-5 w-5" />
          <span className="hidden md:inline">Messages enregistrés</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/profile")}
        >
          <UserCircle className="h-5 w-5" />
          <span className="hidden md:inline">Profil</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5" />
          <span className="hidden md:inline">Paramètres</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={toggleTheme}
        >
          {isDark ? (
            <>
              <Sun className="h-5 w-5" />
              <span className="hidden md:inline">Thème clair</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span className="hidden md:inline">Thème sombre</span>
            </>
          )}
        </Button>
      </div>

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;