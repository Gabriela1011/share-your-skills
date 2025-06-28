import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Subscription } from "@/app/dashboard/admin/[id]/subscriptions/types";


export async function GET() {
    const supabase = await createClient();
    
    const { data, error }: { data: Subscription[] | null; error: any } = await supabase
    .from('subscriptions')
    .select(`
        *,
        subscription_features (
            features (*)
        )
    `);

     console.dir(data, { depth: null });

    if(error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const body = await req.json();
    const features = body.features;

    console.log("body data", body)

    //se creeaza abonamentul
    const { data: subscription, error } = await supabase
        .from("subscriptions")
        .insert([{
            plan_type: body.plan_type,
            price: body.price,
            commission: body.commission,
            target: body.target,
            recommendation: body.recommendation
        }])
        .select()
        .single();
    
    if(error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    const upsertFeatures = await supabase
        .from("features")
        .upsert(
            features.map((featureText: string) => ({ feature: featureText })),
            { onConflict: "feature" }
        )
        console.log(upsertFeatures.error)
    
    if (upsertFeatures.error)
        return NextResponse.json({ error: upsertFeatures.error.message }, { status: 500 });

    //selecteaza toate feature urile din baza de date corepsunzatoare abonamentyului
    const { data: allFeatures, error: fetchFeaturesError } = await supabase
        .from("features")
        .select("*")
        .in("feature", features);

    if (fetchFeaturesError)
        return NextResponse.json({ error: fetchFeaturesError.message }, { status: 500 });

    //creeaza legatura intre abonament si fiecare feature
    const subscriptionFeatures = allFeatures.map((f) => ({
        subscription_id: subscription.id,
        feature_id: f.id
    }))

    const { error: linkError } = await supabase
        .from("subscription_features")
        .insert(subscriptionFeatures);

    if (linkError)
        return NextResponse.json({ error: linkError.message }, { status: 500 });

    //returneaza abonamentul complet cu tot cu features
    const { data: fullSubscription, error: finalFetchError } = await supabase
        .from("subscriptions")
        .select(`
            *,
            subscription_features (
                features (*)
            )
        `)
        .eq("id", subscription.id)
        .single();

    if (finalFetchError)
        return NextResponse.json({ error: finalFetchError.message }, { status: 500 });

    return NextResponse.json(fullSubscription);
}

