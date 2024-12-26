import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const SettingsSection = ({ title, children, className = "" }: SettingsSectionProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};