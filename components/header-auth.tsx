import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import Logo from "./myComponents/Logo";
import UserAvatar from "./myComponents/UserAvatar";
import SidebarToggle from "./sidebar/SidebarToggle";

export default async function HeaderAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("userrr", user);

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Create free account</Link>
        </Button>
      </div>
    );
  }

  const { data: userData } = await supabase
    .from("users")
    .select("profile_picture")
    .eq("id", user.id)
    .single();
    console.log("userdatata", userData)

  const picture = userData?.profile_picture;
  const role = user.user_metadata?.role;
  const id = user.id;
  const dashboardUrl = `/dashboard/${role}/${id}`;

  return (
    <div className="w-full mx-auto px-4 flex justify-between items-center gap-4 text-sm text-muted-foreground">
      <div className="">
        <Logo url={dashboardUrl} />
      </div>

      <div className="flex gap-4 items-center">
        {role !== "admin" && <UserAvatar src={picture} id={user.id} role={role} />}
        <form action={signOutAction}>
          <Button type="submit" variant={"default"}>
            Sign out
          </Button>
        </form>
        <div className="md:hidden p-4">
          <SidebarToggle role={role} id={id} />
        </div>
      </div>
    </div>
  );
}
