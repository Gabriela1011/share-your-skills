import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { add, addDays, differenceInDays, isAfter, parseISO } from "date-fns";


export async function POST(req: NextRequest) {
    const { subscriptionId } = await req.json();
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //gaseste profilul profesorului
    const { data: profile, error: profileError } = await supabase
        .from("teacher_profiles")
        .select("id, subscription_id")
        .eq("user_id", user.id)
        .single();
    
    if (!profile || profileError) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 500 });
    }

    // afla tipul planului ales (pentru a evita inserarea în subscription_payments dacă e FREE)
    const { data: selectedPlan, error: planError } = await supabase
        .from("subscriptions")
        .select("plan_type")
        .eq("id", subscriptionId)
        .single();
    
    if (!selectedPlan || planError) {
        return NextResponse.json({ error: "Plan not found" }, { status: 500 });
    }

    //daca planul nu este FREE , insereaza in susbcription_payments
    if(selectedPlan.plan_type !== 'FREE') {
        const now = new Date();

        //obtine ultima plata activa
        const { data: lastPayment } = await supabase
            .from("subscription_payments")
            .select("ended_at")
            .eq("teacher_id", profile.id)
            .order("ended_at", { ascending: false })
            .limit(1)
            .single();

        let ended_at = addDays(now, 30); //implicit 30 de zile

        const isSamePlan = profile.subscription_id === subscriptionId

        //pentru platile in avans
        if(isSamePlan && lastPayment?.ended_at && isAfter(new Date(lastPayment.ended_at), now)) {
            //inseamna ca planul curent NU a expirat 
            //se adauga zilele ramase la cele 30 de zile noi
            const remainingDays = differenceInDays(new Date(lastPayment.ended_at), now) + 1; 
            ended_at = addDays(now, 30 + remainingDays);
        }


        //adauga plata noua
        const { error: insertError } = await supabase
            .from("subscription_payments")
            .insert({
                teacher_id: profile.id,
                started_at: now.toISOString(),
                ended_at: ended_at.toISOString()
            });
        
        if (insertError) {
            return NextResponse.json({ error: "Failed to insert payment" }, { status: 500 });
        }
    }

    
    //actualizeaza profilul profesorului
    const { error: updateError } = await supabase
        .from("teacher_profiles")
        .update({ subscription_id: subscriptionId })
        .eq("id", profile.id)

    if (updateError) {
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}