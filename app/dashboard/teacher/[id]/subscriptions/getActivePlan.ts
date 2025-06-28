import { createClient } from "@/utils/supabase/server";
import { isBefore } from "date-fns";

export default async function getActivePlan(userId: string) {
    const supabase = await createClient();

    //cauta profilul profesorului
    const { data: teacherProfile, error: profileError } = await supabase
        .from("teacher_profiles")
        .select("id, subscription_id")
        .eq("user_id", userId)
        .single();
        
    if(!teacherProfile || profileError){
        console.error("Teacher profile not found", profileError.message);
        return null;
    }
        
    //cautam abonamentul activ al profesorului
    const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id",teacherProfile.subscription_id)
        .single();
    
    if (!subscription || subscriptionError) {
        console.error("Subscription not found", subscriptionError?.message);
        return null;
    }

    //perioada activa a abonamentului (daca e abonament pro sau basic)
    //ultima plata
    const { data: payment, error: paymentError } = await supabase
        .from("subscription_payments")
        .select("started_at, ended_at")
        .eq("teacher_id", teacherProfile.id)
        .order("started_at", {ascending: false})
        .limit(1)
        .single();
    
    if (paymentError) {
        console.warn("No payment record found:", paymentError.message);
    }
    
    //daca planul e basic sau pro dar a expirat si nu s a realizat plata, setam automat la free
    if(subscription.plan_type !==  'FREE' && payment?.ended_at) {
        const now = new Date();
        const endedAt = new Date(payment.ended_at);

        if(isBefore(endedAt, now)) {
            //actualizeaza abonamentul la FREE
            const { data: freePlan } = await supabase
                .from("subscriptions")
                .select("*")
                .eq("plan_type", "FREE")
                .single();
            
            if(freePlan?.id) {
                await supabase
                    .from("teacher_profiles")
                    .update({ subscription_id: freePlan.id })
                    .eq("id", teacherProfile.id)
            }

            return{
                ...freePlan,
                started_at: null,
                ended_at: null
            }
        }
    }
    
    

    return {
        ...subscription,
        started_at: payment?.started_at ?? null,
        ended_at: payment?.ended_at ?? null
    }
}