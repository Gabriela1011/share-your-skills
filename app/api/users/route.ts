import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const {data, error} = await supabase.from("users").select("*");


    if(error)
    {
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json(data);
}