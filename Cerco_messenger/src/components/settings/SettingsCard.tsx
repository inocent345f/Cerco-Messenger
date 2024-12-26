import { ReactNode } from "react";

interface SettingsCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export const SettingsCard = ({ icon, title, children }: SettingsCardProps) => {
  return (
    <div className="p-4 bg-card rounded-lg shadow-sm border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-md group">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary transition-transform group-hover:scale-110 duration-200">{icon}</div>
        <span className="text-foreground font-medium group-hover:text-primary transition-colors">{title}</span>
      </div>
      {children}
    </div>
  );
};