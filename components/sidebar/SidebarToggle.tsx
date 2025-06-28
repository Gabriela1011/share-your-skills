import { Menu, X, PanelLeftClose } from "lucide-react";
import RoleSidebar from "./RoleSidebar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

interface SidebarProps {
  role: string;
  id: string;
}

export default function SidebarToggle({ role, id }: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <RoleSidebar role={role} id={id} />
      </SheetContent>
    </Sheet>
  );
}
