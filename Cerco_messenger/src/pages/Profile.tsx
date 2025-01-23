import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [profile, setProfile] = useState<UserProfile>({
    id: "default-id",
    username: "default-username",
    name: "Utilisateur",
    phone: "default-phone",
    description: "default-description",
    avatar: undefined,
    online: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get username from localStorage or use a default
        const username = localStorage.getItem('username');
        if (!username) {
          console.error('Username not found in localStorage');
          return;
        }
       // console.log(localStorage)
        const response = await axios.get(`${API_URL}/user?username=${username}`);
        const user = response.data;
       // console.log('User data:', user);
        setProfile({
          ...user,
          name: user.username ? user.username : "Utilisateur",
          ///phone: user.phone || "default-phone",
          ///description: user.description || "default-description",
          ///online: true,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...editedProfile };
    setProfile(updatedProfile);

    try {
      await axios.put("/api/user", updatedProfile); // Remplacez "/api/user" par l'URL de votre API
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }

    setIsEditing(false);
    setEditedProfile({});
  };

  const handleAvatarChange = (file: File) => {
    if (!isEditing) {
      toast({
        title: "Mode édition requis",
        description: "Veuillez activer le mode édition pour modifier votre photo de profil",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProfile = { ...profile, avatar: reader.result as string };
      setProfile(updatedProfile);
      // Vous pouvez également envoyer la nouvelle photo de profil à votre API ici
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
        variant: "destructive",
      });
      return;
    }

    const updatedProfile = { ...profile, avatar: undefined };
    setProfile(updatedProfile);
    // Vous pouvez également envoyer la suppression de la photo de profil à votre API ici
    toast({
      title: "Photo de profil supprimée",
      description: "Votre photo de profil a été supprimée avec succès",
    });
  };

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
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-primary mt-1">@{profile.username}</p>
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
