import { createClient } from "@/utils/supabase/server";

export default async function getSessionPrice(teacherSkillId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("teacher_skills")
        .select("price")
        .eq("id", teacherSkillId)
        .single();

    if (error) {
        console.error("Error fetching price for teacher skill:", error);
        return null;
    }

    return data.price;
}