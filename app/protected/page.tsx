import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  
  const { data: { user }} = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const role = user.user_metadata?.role;
  const id = user.id;

  if (role === "student") {
    return redirect(`/dashboard/student/${id}`);
  } else if (role === "teacher") {
    return redirect(`/dashboard/teacher/${id}`);
  } else if (role === "admin") {
    return redirect(`/dashboard/admin/${id}`);
  }
  
  return redirect("/sign-in");
}
