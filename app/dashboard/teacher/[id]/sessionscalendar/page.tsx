import getTeacherSessions from "./getTeacherSessions";
import TeacherCalendar from "./TeacherCalendar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { RawSubscription } from "@/app/dashboard/types";
import AddTimeSlot, { SlotsProps } from "@/components/myComponents/AddTimeSlot";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Legend from "@/components/myComponents/Legend";
import { parse, isAfter, compareAsc, format } from "date-fns";
import AvailableSlotsList from "@/components/myComponents/AvailableSlotsList";
import { revalidatePath } from "next/cache";


export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    console.error("nu exista user");
    return;
  }

  //obtinem id ul profesorului din teacher_profiles
  const { data: profile, error: profileError} = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

    if(profileError || !profile) {
      console.error('Eroare la extragerea id-ului profesorului:', profileError);
      return;
    }

  //verifica abonamentul activ al profesorului
  const { data: subscription, error: subscriptionError } = await supabase
    .from("teacher_profiles")
    .select( `subscriptions (plan_type)` )
    .eq("id", profile.id)
    .single();
    console.log("abonament", subscription)

  if(subscriptionError) {
    return redirect ("/dashboard/teacher/${UserId}/sessionscalendar/unauthorizedCalendar");
  }

  //daca nu are abonament BASIC sau PRO, nu afiseaza nimic
  //caci nu are acces la calendar in abonamentul FREE

  const teacherSubscription = subscription as unknown as RawSubscription;

   if(!subscription || teacherSubscription.subscriptions.plan_type === "FREE") {
     return null;
   }
  
  const sessions = await getTeacherSessions();
  console.log("Teacher sessions din supabase:", sessions);

  const { data: slotsRaw, error: slotsError } = await supabase
   .from("available_slots")
   .select("*")
   .eq("teacher_id", profile.id)
   .eq("is_booked", false)

  const now = new Date();

  const slots: SlotsProps[] = (slotsRaw ?? []).map((slot) => {
    // slot.date = '2025-06-20' (string)
    // slot.hour_start = '13:00:00' (string)
    const combined = `${slot.date} ${slot.hour_start}`
    const dateTime = parse(combined, "yyyy-MM-dd HH:mm:ss", new Date());
    return { ...slot, dateTime }
  })
  .filter((slot) => isAfter(slot.dateTime, now))
  .sort((a, b) => compareAsc(a.dateTime, b.dateTime));

  return (
  <div className="flex flex-col items-start gap-6">
    <Dialog modal={false}>
      <DialogTrigger className="p-2 mt-4 rounded-md bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-semibold hover:shadow-xl hover:text-black">
        Add Time Slot
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Available Time Slots</DialogTitle>
          <DialogDescription>
            Select a date and start time to create a new slot.
          </DialogDescription>
          <AddTimeSlot slots={slots} />
        </DialogHeader>
      </DialogContent>
    </Dialog>

    <div className="flex flex-wrap w-full justify-between items-start gap-6">
      <TeacherCalendar sessions={sessions} />
      <Legend />
    </div>
    
    <AvailableSlotsList slots={slots} isStudent={false} />
  </div>);
}
