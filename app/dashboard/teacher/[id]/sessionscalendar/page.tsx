import getTeacherSessions from "./getTeacherSessions";
import TeacherCalendar from "./TeacherCalendar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { RawSubscription } from "@/app/dashboard/types";
import AddTimeSlot, { SlotsProps } from "@/components/myComponents/AddTimeSlot";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Legend from "@/components/myComponents/Legend";
import AvailableSlotsList from "@/components/myComponents/AvailableSlotsList";
import getSlots from "../getSlots";
import DialogAddTimeSlot from "@/components/myComponents/DialogAddTimeSlot";


export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    console.error("user doesn't exist");
    return;
  }

  //obtinem id ul profesorului din teacher_profiles
  const { data: profile, error: profileError} = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

    if(profileError || !profile) {
      console.error('Error retrieving teacherID', profileError);
      return;
    }

  
  //verifica abonamentul activ al profesorului
  const { data: subscription, error: subscriptionError } = await supabase
    .from("teacher_profiles")
    .select( `subscriptions (plan_type)` )
    .eq("id", profile.id)
    .single();

  if(subscriptionError) {
    return redirect (`/dashboard/teacher/${user.id}/sessionscalendar/unauthorizedCalendar`);
  }

  //daca nu are abonament BASIC sau PRO, nu afiseaza nimic
  //caci nu are acces la calendar in abonamentul FREE

  const teacherSubscription = subscription as unknown as RawSubscription;

   if(!subscription || teacherSubscription.subscriptions.plan_type === "FREE") {
     return null;
   }
  
  const sessions = await getTeacherSessions();
  const slots = await getSlots(profile.id);

  return (
  <div className="flex flex-col items-start gap-6">
    <DialogAddTimeSlot slots={slots} />

    <div className="flex flex-wrap w-full justify-between items-start gap-6">
      <TeacherCalendar sessions={sessions} />
      <Legend />
    </div>
    
    <AvailableSlotsList slots={slots} isStudent={false} />
  </div>);
}
