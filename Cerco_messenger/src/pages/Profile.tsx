import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string;
  name: string;
  phone: string;
  description: string;
  avatar?: string;
  online: boolean;
}

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setProfile({
        ...user,
        name: user.name || "Utilisateur",
        phone: user.phone || "",
        description: user.description || "",
        online: true,
      });
    }
  }, []);

  const handleEditChange = (field: string, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...editedProfile };
    setProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    
    toast({
      title: "Profil mis à jour",
      description: "Vos modifications ont été enregistrées avec succès",
    });
    
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleAvatarChange = (file: File) => {
    if (!isEditing) {
      toast({
        title: "Mode édition requis",
        description: "Veuillez activer le mode édition pour modifier votre photo de profil",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => prev ? { ...prev, avatar: reader.result as string } : null);
      localStorage.setItem("user", JSON.stringify({ 
        ...profile, 
        avatar: reader.result 
      }));
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre photo de profil a été modifiée avec succès",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    if (!isEditing) {
      toast({
        title: "Mode édition requis",
        description: "Veuillez activer le mode édition pour supprimer votre photo de profil",
        variant: "destructive"
      });
      return;
    }

    setProfile(prev => prev ? { ...prev, avatar: undefined } : null);
    localStorage.setItem("user", JSON.stringify({ 
      ...profile, 
      avatar: undefined 
    }));
    toast({
      title: "Photo de profil supprimée",
      description: "Votre photo de profil a été supprimée avec succès",
    });
  };

   if (!profile) {
    return ;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <ProfileHeader />
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-20 max-w-2xl mx-auto w-full">
          <div className="flex justify-end mt-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-accent"
              onClick={() => {
                if (isEditing) {
                  setEditedProfile({});
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? <X className="h-6 w-6" /> : <Edit2 className="h-6 w-6" />}
            </Button>
          </div>

          <ProfileAvatar 
            avatar={profile.avatar}
            name={profile.name}
            onAvatarChange={handleAvatarChange}
            onAvatarRemove={handleAvatarRemove}
            isEditing={isEditing}
          />
          
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">
                {profile.name}
              </h1>
              <p className="text-primary mt-1">
                @{profile.username}
              </p>
            </div>

            <ProfileForm 
              isEditing={isEditing}
              profile={profile}
              editedProfile={editedProfile}
              onEditChange={handleEditChange}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setEditedProfile({});
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
