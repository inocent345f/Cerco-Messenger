import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
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
        //const response = await axios.get(`http://127.0.0.1:8000/user?username=${username}`);
        const response = await axios.get(`${API_URL}/user?username=${username}`);
        const user = response.data;
       // console.log('User data:', user);
        setProfile({
          ...user,
          name: user.name ? user.name : "Utilisateur",
          phone: user.phone || "default-phone",
          description: user.description || "default-description",
          avatar: user.profile_picture_url, // Utiliser l'URL de la photo de profil
          online: true,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditChange = (field: string, value: string) => {
    console.log('Modification du champ:', field, 'avec la valeur:', value);
    setEditedProfile((prev) => {
      const newProfile = { ...prev, [field]: value };
      console.log('Nouveau profil édité:', newProfile);
      return newProfile;
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const username = localStorage.getItem('username');
      if (!username) {
        toast({
          title: "Erreur",
          description: "Utilisateur non connecté",
          variant: "destructive",
        });
        return;
      }

      console.log('Données à mettre à jour:', editedProfile);

      // Préparer les données à mettre à jour
      const updatedData = {
        username: username,
        name: editedProfile.name !== undefined ? editedProfile.name : profile.name,
        phone: editedProfile.phone !== undefined ? editedProfile.phone : profile.phone,
        description: editedProfile.description !== undefined ? editedProfile.description : profile.description,
        profile_picture_url: profile.avatar
      };

      console.log('Données envoyées au serveur:', updatedData);

      // Envoyer les modifications au backend
      //const response = await axios.put(`http://127.0.0.1:8000/update-user`, updatedData);
      const response = await axios.put(`${API_URL}/update-user`, updatedData);

      console.log('Réponse du serveur:', response.data);

      if (response.data.status === "success") {
        // Mettre à jour l'état local avec les nouvelles données
        const newProfile = {
          ...profile,
          name: updatedData.name,
          phone: updatedData.phone,
          description: updatedData.description,
          avatar: updatedData.profile_picture_url
        };

        console.log('Nouveau profil:', newProfile);
        setProfile(newProfile);

        toast({
          title: "Profil mis à jour",
          description: "Vos modifications ont été enregistrées avec succès",
        });

        // Réinitialiser le mode édition
        setIsEditing(false);
        setEditedProfile({});
      } else {
        throw new Error("La mise à jour a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!isEditing) {
      toast({
        title: "Mode édition requis",
        description: "Veuillez activer le mode édition pour modifier votre photo de profil",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          if (!reader.result) {
            throw new Error("Échec de la lecture du fichier");
          }

          const base64Data = reader.result.toString().split(',')[1];
          const username = localStorage.getItem('username');
          const token = localStorage.getItem('token');
          
          if (!username || !token) {
            toast({
              title: "Erreur",
              description: "Utilisateur non connecté",
              variant: "destructive",
            });
            return;
          }

          console.log('Début de l\'upload de la photo...');
          console.log('Type de fichier:', file.type);
          console.log('Taille du fichier:', file.size, 'bytes');
          
          try {
            const response = await axios.post(`${API_URL}/update-profile-picture`, {
              username: username,
              file_data: base64Data
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            console.log('Réponse du serveur:', response.data);

            if (response.data.status === "success" && response.data.profile_picture_url) {
              // Mettre à jour l'état local avec la nouvelle URL de la photo
              setProfile(prev => ({
                ...prev,
                avatar: response.data.profile_picture_url
              }));

              toast({
                title: "Photo de profil mise à jour",
                description: "Votre photo de profil a été modifiée avec succès",
              });
            } else {
              console.error('Réponse du serveur invalide:', response.data);
              throw new Error("La mise à jour de la photo a échoué : réponse invalide du serveur");
            }
          } catch (uploadError: any) {
            console.error("Erreur détaillée de l'upload:", {
              message: uploadError.message,
              response: uploadError.response?.data,
              status: uploadError.response?.status,
              headers: uploadError.response?.headers
            });

            // Afficher un message d'erreur plus détaillé
            let errorMessage = "Impossible de mettre à jour la photo de profil";
            if (uploadError.response?.status === 403 || 
                (uploadError.response?.data?.detail && uploadError.response.data.detail.includes('Unauthorized'))) {
              errorMessage = "Session expirée. Veuillez vous reconnecter.";
            } else if (uploadError.response?.data?.detail) {
              errorMessage = uploadError.response.data.detail;
            } else if (uploadError.response?.status === 500) {
              errorMessage = "Erreur serveur. La taille de l'image est peut-être trop grande. Veuillez réessayer avec une image plus petite.";
            }

            toast({
              title: "Erreur",
              description: errorMessage,
              variant: "destructive",
            });

            // Si c'est une erreur d'authentification, rediriger vers la page de connexion
            if (uploadError.response?.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              window.location.href = '/auth';
            }
          }
        } catch (error: any) {
          console.error("Erreur lors du traitement ou de l'envoi de la photo:", error);
          toast({
            title: "Erreur",
            description: error.message || "Impossible de mettre à jour la photo de profil",
            variant: "destructive",
          });
        }
      };

      reader.onerror = (error) => {
        console.error("Erreur lors de la lecture du fichier:", error);
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier image",
          variant: "destructive",
        });
      };

      console.log('Début de la lecture du fichier...');
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur générale lors du traitement de la photo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter la photo",
        variant: "destructive",
      });
    }
  };

  const handleAvatarRemove = async () => {
    if (!isEditing) {
      toast({
        title: "Mode édition requis",
        description: "Veuillez activer le mode édition pour supprimer votre photo de profil",
        variant: "destructive",
      });
      return;
    }

    try {
      const username = localStorage.getItem('username');
      if (!username) {
        toast({
          title: "Erreur",
          description: "Utilisateur non connecté",
          variant: "destructive",
        });
        return;
      }

      // Envoyer la requête de suppression au backend
      //const response = await axios.delete("http://127.0.0.1:8000/remove-profile-picture", {
      const response = await axios.delete(`${API_URL}/remove-profile-picture`, {
        data: { username }
      });

      if (response.data.status === "success") {
        // Mettre à jour l'état local en supprimant l'avatar
        setProfile(prev => ({
          ...prev,
          avatar: undefined
        }));

        toast({
          title: "Photo de profil supprimée",
          description: "Votre photo de profil a été supprimée avec succès",
        });
      } else {
        throw new Error("La suppression de la photo a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo de profil:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo de profil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <ProfileHeader />

      <div className="flex-1 overflow-y-auto">
        <div className={`px-4 md:px-6 pb-20 mx-auto w-full ${isMobile ? 'max-w-full' : 'max-w-2xl'}`}>
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
            isMobile={isMobile}
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
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
