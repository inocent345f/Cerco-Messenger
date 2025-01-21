import { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Sun, Moon } from "lucide-react"; // Import des icônes Sun et Moon
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleForm = () => setIsLogin((prev) => !prev);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    document.documentElement.classList.toggle("dark", newTheme);
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    toast({
      title: "Thème modifié",
      description: `Le thème ${newTheme ? "sombre" : "clair"} a été activé`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        {isDarkMode ? (
          <Sun className="h-6 w-6 cursor-pointer" onClick={toggleTheme} />
        ) : (
          <Moon className="h-6 w-6 cursor-pointer" onClick={toggleTheme} />
        )}
      </div>
      {isLogin ? (
        <LoginForm onToggle={toggleForm} />
      ) : (
        <RegisterForm onToggle={toggleForm} />
      )}
    </div>
  );
};

export default Auth;
