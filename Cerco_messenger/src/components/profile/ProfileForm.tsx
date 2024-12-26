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
}

export const ProfileForm = ({
  isEditing,
  profile,
  editedProfile,
  onEditChange,
  onSave,
  onCancel
}: ProfileFormProps) => {
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="bg-accent/50 rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
          <p className="text-foreground mt-1">{profile.phone || "Non renseigné"}</p>
        </div>
        <div className="bg-accent/50 rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-foreground mt-1">{profile.description || "Aucune description"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground">Nom</label>
        <Input
          value={editedProfile.name ?? profile.name}
          onChange={(e) => onEditChange("name", e.target.value)}
          placeholder="Votre nom"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
        <Input
          value={editedProfile.phone ?? profile.phone}
          onChange={(e) => onEditChange("phone", e.target.value)}
          placeholder="Votre numéro de téléphone"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Description</label>
        <Textarea
          value={editedProfile.description ?? profile.description}
          onChange={(e) => onEditChange("description", e.target.value)}
          placeholder="Décrivez-vous en quelques mots"
          className="mt-1 h-32"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button onClick={onSave} className="flex-1">
          <Check className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>
    </div>
  );
};