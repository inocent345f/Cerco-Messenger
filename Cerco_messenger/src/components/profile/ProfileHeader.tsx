import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 flex items-center justify-between border-b border-border bg-card">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate(-1)}
        className="hover:bg-accent"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-lg font-semibold">Profil</h1>
      <div className="w-10" /> {/* Spacer for alignment */}
    </div>
  );
};