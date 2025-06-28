import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { isAfter } from 'date-fns';

export async function GET(req: NextRequest, { params }: { params: Promise<{ teacherSkillId: string }> }) {
    const supabase = await createClient();
    const { teacherSkillId } = await params;

    if(!teacherSkillId) {
        return NextResponse.json({error: "Missing  teacher skill ID"}, {status: 400});
    }

    //luam teacher_id din teacher_skills
    const { data: teacherSkillData, error: teacherSkillError } = await supabase
        .from("teacher_skills")
        .select("teacher_id")
        .eq("id", teacherSkillId)
        .single();

    if(teacherSkillError || !teacherSkillData){
        return NextResponse.json({ error: 'Invalid teacher skill ID' }, { status: 400 });
    }

    const teacherId = teacherSkillData.teacher_id;

    //luam sloturile disponibile pentru acel teacher
    const { data: slots, error: slotsError } = await supabase
        .from("available_slots")
        .select("*")
        .eq("teacher_id", teacherId)
        .eq("is_booked", false)
        .order("date", { ascending: true })
    
    if (slotsError) {
        return NextResponse.json({ error: 'Error fetching slots' }, { status: 500 });
    }

    const now = new Date();
    
    const validSlots = slots?.filter((slot) => {
        const combined = new Date(`${slot.date}T${slot.hour_start}`);
        return isAfter(combined, now);
    });


    return NextResponse.json(validSlots);
}