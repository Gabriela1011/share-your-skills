"use server"

import { addMinutes, format, parse } from "date-fns";
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";

export async function saveSlot(prev:unknown, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    //extragem datele din formular
        const date = formData.get("date") as string;
        const hour_start = formData.get("hour_start") as string;
    
    if (!userId) {
        console.log("Error userId ");
        return;
    }

    try {
          // obține id-ul profilului profesorului
        const { data: teacherProfile } = await supabase
        .from("teacher_profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

        if (!teacherProfile) return;
        // Transforma 10:30 în 10:30:00
        const time24 = format(parse(hour_start, "HH:mm", new Date()), "HH:mm:ss");
        const combined = `${date}T${time24}`;
        const startDate = new Date(combined);
        const endDate = addMinutes(startDate, 90);
        const hour_end = format(endDate, "HH:mm:ss");

         await supabase.from("available_slots").insert({
            date,
            hour_start,
            hour_end,
            is_booked: false,
            teacher_id: teacherProfile.id,
        });
        
        revalidatePath('/dashboard/teacher/[id]/sessionscalendar')
        return { success: true, message: 'Slot saved successfully!' };

    }catch (err) {
        console.error("Error saving slot", err);
        return { success: false, message: 'An error occurred while saving the slot.' };
    }
}