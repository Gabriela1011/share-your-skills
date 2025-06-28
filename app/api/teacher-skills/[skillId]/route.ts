import { createClient } from "@/utils/supabase/server";
import { NextResponse, NextRequest } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ skillId: string }> }) {
    const { skillId } = await params;

    if(!skillId) {
        return NextResponse.json({error: "Missing  skill ID"}, {status: 400});
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if(!user || authError){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
        .from("teacher_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
    
    if (profileError || !profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabase
        .from("teacher_skills")
        .delete()
        .eq("teacher_id", profile.id)
        .eq("skill_id", skillId);
    
    if (deleteError) {
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 });
}