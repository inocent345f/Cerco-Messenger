import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MessageSquare,
  Users,
  Bookmark,
  Settings,
  Sun,
  Moon,
  LogOut,
  UserCircle,
  Menu,
} from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/auth");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const NavContent = () => (
    <>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/283a273b-d013-414a-96a8-cf46bce6668a.png" 
            alt="Cerco Messenger" 
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-bold">Cerco Messenger</h1>
        </div>
      </div>
      
      <div className="flex-1 px-2 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-accent"
          onClick={() => handleNavigation("/")}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-accent"
          onClick={() => handleNavigation("/contacts")}
        >
          <Users className="h-5 w-5" />
          <span>Contacts</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-accent"
          onClick={() => handleNavigation("/saved-messages")}
        >
          <Bookmark className="h-5 w-5" />
          <span>Messages enregistrés</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-accent"
          onClick={() => handleNavigation("/profile")}
        >
          <UserCircle className="h-5 w-5" />
          <span>Profil</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-accent"
          onClick={() => handleNavigation("/settings")}
        >
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-accent"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-5 w-5" />
              <span>Thème clair</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span>Thème sombre</span>
            </>
          )}
        </Button>
      </div>

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 px-4 flex items-center justify-between">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <NavContent />
            </SheetContent>
          </Sheet>
          <img 
            src="/lovable-uploads/283a273b-d013-414a-96a8-cf46bce6668a.png" 
            alt="Cerco Messenger" 
            className="h-8 w-auto"
          />
          <div className="w-10" />
        </div>
      ) : (
        <div className="w-16 md:w-64 h-full bg-card border-r border-border flex flex-col">
          <NavContent />
        </div>
      )}

      <div className={`flex-1 overflow-hidden ${isMobile ? "pt-16" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;