import { Smartphone, Laptop, Clock } from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Device {
  id: string;
  name: string;
  type: "mobile" | "desktop";
  lastActive: Date;
  current: boolean;
}

const getDeviceIcon = (type: Device["type"]) => {
  return type === "mobile" ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />;
};

export const ConnectedDevices = () => {
  // Simuler des appareils connectés réels
  const devices: Device[] = [
    {
      id: "1",
      name: "iPhone 13",
      type: "mobile",
      lastActive: new Date(),
      current: true,
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "desktop",
      lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 heure
      current: false,
    },
  ];

  return (
    <>
      {devices.map((device) => (
        <SettingsCard
          key={device.id}
          icon={getDeviceIcon(device.type)}
          title={device.name}
        >
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {device.current
                ? "Appareil actuel"
                : `Dernière activité : ${formatDistanceToNow(device.lastActive, {
                    addSuffix: true,
                    locale: fr,
                  })}`}
            </span>
          </div>
        </SettingsCard>
      ))}
    </>
  );
};