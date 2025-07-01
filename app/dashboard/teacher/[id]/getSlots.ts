import { SlotsProps } from "@/components/myComponents/AddTimeSlot";
import { createClient } from "@/utils/supabase/server";
import { parse, isAfter, compareAsc } from "date-fns";

export default async function getSlots(teacherProfileId: string) {
    const supabase = await createClient()

    const { data: slotsRaw, error: slotsError } = await supabase
       .from("available_slots")
       .select("*")
       .eq("teacher_id", teacherProfileId)
       .eq("is_booked", false)
    
      const now = new Date();
    
    const slots: SlotsProps[] = (slotsRaw ?? []).map((slot) => {
        // slot.date = 2025-06-20 
        // slot.hour_start = 13:00:00
        const combined = `${slot.date} ${slot.hour_start}`
        const dateTime = parse(combined, "yyyy-MM-dd HH:mm:ss", new Date());
        return { ...slot, dateTime }
      })
      .filter((slot) => isAfter(slot.dateTime, now))
      .sort((a, b) => compareAsc(a.dateTime, b.dateTime));

    return slots;
}
