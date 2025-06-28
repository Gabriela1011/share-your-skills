import TeacherSidebar from "./TeacherSidebar";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";
import { createClient } from "@/utils/supabase/server";
import { RawSubscription } from "@/app/dashboard/types";

export default async function RoleSidebar({ role, id }: { role: string; id: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: teacherProfile } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("user_id", user?.id)
    .single();

    const teacherProfileId = teacherProfile?.id;

    //verifica abonamentul activ al profesorului
    const { data: subscription, error: subscriptionError } = await supabase
    .from("teacher_profiles")
    .select( `subscriptions (plan_type)` )
    .eq("id", teacherProfile?.id)
    .single();
    
    const teacherSubscription = subscription as unknown as RawSubscription;

    switch(role) {
        case "teacher":
            return <TeacherSidebar id={id} subscriptionType={teacherSubscription.subscriptions.plan_type ?? null} />;
        case "student":
            return <StudentSidebar id={id} />;
        case "admin":
            return <AdminSidebar id={id} />;
        default:
            return <div className="text-sm text-muted-foreground">unknown role</div>
    }
}