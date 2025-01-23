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
}

export const ProfileAvatar = ({ 
  avatar, 
  name, 
  onAvatarChange, 
  onAvatarRemove,
  isEditing 
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
          className={`w-32 h-32 border-4 border-primary ${
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
            <User className="h-12 w-12 text-primary" />
          </AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 h-8 w-8"
              onClick={handleAvatarClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            {avatar && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
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
