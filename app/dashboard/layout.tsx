import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import RoleSidebar from "@/components/sidebar/RoleSidebar";
import SidebarToggle from "@/components/sidebar/SidebarToggle";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role = user.user_metadata?.role;
  const id = user.id;

  return (
    <div className="text-foreground min-h-screen w-full">
      <div className="flex relative w-full min-h-screen">
        <aside className="hidden md:block sticky left-0 top-16 self-start w-64 p-4 bg-white border-r border-gray-200 rounded-r-xl shadow-md">
          <RoleSidebar role={role} id={id} />
        </aside>

        <section className="pl-6 w-full">{children}</section>
      </div>
    </div>
  );
}
