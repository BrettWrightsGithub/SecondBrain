import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Globe } from "lucide-react";

interface PrivacyToggleProps {
  isPrivate: boolean;
  onToggle: (value: boolean) => void;
}

export function PrivacyToggle({ isPrivate, onToggle }: PrivacyToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded-lg">
      <Switch
        id="privacy-mode"
        checked={isPrivate}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="privacy-mode" className="flex items-center gap-1">
        {isPrivate ? (
          <>
            <Lock className="h-4 w-4" />
            <span>Private</span>
          </>
        ) : (
          <>
            <Globe className="h-4 w-4" />
            <span>Public</span>
          </>
        )}
      </Label>
    </div>
  );
}
