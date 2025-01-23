import React from "react";
import { Camera, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  onAvatarChange: (file: File) => void;
  onAvatarRemove: () => void;
  isEditing: boolean;
  isMobile: boolean;
}

export const ProfileAvatar = ({ 
  avatar, 
  name, 
  onAvatarChange, 
  onAvatarRemove,
  isEditing,
  isMobile
}: ProfileAvatarProps) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="relative group">
        <Avatar 
          className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} border-4 border-primary ${
            isEditing ? "cursor-pointer transition-transform hover:scale-105" : ""
          }`}
          onClick={handleAvatarClick}
        >
          <AvatarImage 
            src={avatar} 
            alt={`Photo de profil de ${name}`}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10">
            <User className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-primary`} />
          </AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            <Button
              size="icon"
              className={`rounded-full bg-primary hover:bg-primary/90 ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}
              onClick={handleAvatarClick}
            >
              <Camera className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
            
            {avatar && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    className={`rounded-full ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}
                  >
                    <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer la photo de profil ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={onAvatarRemove}>
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
