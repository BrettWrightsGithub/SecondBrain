import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Brain } from "lucide-react";
import { CognitionPanel } from "../cognition/CognitionPanel";

export function Header() {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <h1 className="text-lg font-semibold">Second Brain</h1>
      
      <div className="flex items-center gap-2">
        <CognitionPanel />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>BW</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
