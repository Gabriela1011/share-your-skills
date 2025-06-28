import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: studentProfile, error: profileError } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user?.id)
    .single();

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

    const { data: vouchers, error: vouchersError } = await supabase
        .from("vouchers")
        .select("*")
        .eq("student_id", studentProfile.id);

    if (vouchersError) return NextResponse.json({ error: vouchersError.message }, { status: 500 });

    return NextResponse.json({ vouchers });
}