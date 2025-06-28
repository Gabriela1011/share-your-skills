import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Subscription } from "@/app/dashboard/admin/[id]/subscriptions/types";
import { syncSubscriptionFeatures } from "@/app/dashboard/admin/[id]/subscriptions/syncSubscriptionFeatures";


export async function DELETE(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if(!id) {
        return NextResponse.json({error: "Missing  subscription ID"}, {status: 400});
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if(!user || authError) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
console.log("rolul utilizatorului atunci cand sterge un abonament", user.user_metadata.role);

    if(user.user_metadata.role !== 'admin') {
        return NextResponse.json({ message: "You don't have permission to delete subscriptions." }, { status: 403 });
    }

    const { error: deleteError } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id)
            
    if (deleteError) {
        console.error("Supabase delete error:", deleteError);
        return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
    }
        
    return NextResponse.json({ message: "Subscription deleted successfully" }, { status: 200 });
    
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    const { features, ...subscriptionData } = body;
    
    if(!id) {
        return NextResponse.json({error: "Missing  subscription ID"}, {status: 400});
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if(!user || authError) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if(user.user_metadata.role !== 'admin') {
        return NextResponse.json({ message: "You don't have permission to delete subscriptions." }, { status: 403 });
    }

    //actualizeaza abonamentul
    const { data: updatedSubscription, error } = await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("id", id)
        .select()
        .single();
    
    if(error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    //aduce lista de subscription_features asociate abonamentului
    const { data: subscriptionFeatures, error: featuresError } = await supabase
        .from("subscription_features")
        .select(`
            *,
            features(*)
        `)
        .eq("subscription_id", id);

    if (featuresError) {
        return NextResponse.json({ error: featuresError.message }, { status: 500 });
    }

    //obiect complet abonament+features
    const result = {
        ...updatedSubscription,
        subscription_features: subscriptionFeatures || []
    }
    return NextResponse.json(result);
}


