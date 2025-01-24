import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Profile {
  name: string;
  phone: string;
  description: string;
}

interface ProfileFormProps {
  isEditing: boolean;
  profile: Profile;
  editedProfile: Partial<Profile>;
  onEditChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isMobile: boolean;
}

export const ProfileForm = ({
  isEditing,
  profile,
  editedProfile,
  onEditChange,
  onSave,
  onCancel,
  isMobile
}: ProfileFormProps) => {
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className={`bg-accent/50 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
          <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
          <p className="text-foreground mt-1">{profile.phone || "Non renseigné"}</p>
        </div>
        <div className={`bg-accent/50 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-foreground mt-1">{profile.description || "Aucune description"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isMobile ? 'px-2' : ''}`}>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Nom</label>
        <Input
          value={editedProfile.name !== undefined ? editedProfile.name : profile.name}
          onChange={(e) => {
            console.log('Changement du nom:', e.target.value);
            onEditChange("name", e.target.value);
          }}
          placeholder="Votre nom"
          className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
        <Input
          value={editedProfile.phone !== undefined ? editedProfile.phone : profile.phone}
          onChange={(e) => {
            console.log('Changement du téléphone:', e.target.value);
            onEditChange("phone", e.target.value);
          }}
          placeholder="Votre numéro de téléphone"
          className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
          type="tel"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Description</label>
        <Textarea
          value={editedProfile.description !== undefined ? editedProfile.description : profile.description}
          onChange={(e) => {
            console.log('Changement de la description:', e.target.value);
            onEditChange("description", e.target.value);
          }}
          placeholder="Décrivez-vous en quelques mots"
          className={`mt-1 ${isMobile ? 'h-24 text-sm' : 'h-32'}`}
        />
      </div>
      <div className={`flex gap-2 ${isMobile ? 'pt-2' : 'pt-4'}`}>
        <Button onClick={onSave} className="flex-1">
          <Check className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
          Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <X className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
          Annuler
        </Button>
      </div>
    </div>
  );
};
