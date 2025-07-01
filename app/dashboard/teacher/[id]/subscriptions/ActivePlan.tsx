"use client"

import { CheckCircleIcon } from "lucide-react";
import getActivePlan from "./getActivePlan"
import { createClient } from "@/utils/supabase/server";
import { PlanProps } from "./types";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import Spinner from "@/components/myComponents/Spinner";
import { useRouter } from "next/navigation";

type Props ={
    currentPlan: PlanProps;
}

export default function ActivePlan({currentPlan} : Props) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();


   // verificam daca este abonament platit
    const isPaidPlan = currentPlan?.plan_type !== "FREE";

    const handleRenewSubscription = async () => {
        try{
            setLoading(true);
            
            const res = await fetch("/api/subscription_payments", {
                method: "POST",
                body: JSON.stringify({ subscriptionId: currentPlan.id }),
            });

            const result = await res.json();

            if(res.ok && result.success) {
                setMessage("Subscription successfully renewed.");
                router.refresh(); // reîncarcă abonamentul activ
            }
        } catch (err) {
            console.error("Renew error:", err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="bg-white p-6 rounded-lg shadow-md w-full border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Your Active Subscription
                </h2>
                {isPaidPlan ? (
                    <span className="text-md px-2 py-1 bg-green-100 text-green-800 rounded-full">Paid Plan</span>
                ): <span className="text-md px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Free</span>}
            </div>

            <div className="flex items-center gap-3">
                <CheckCircleIcon className="text-green-500 w-6 h-6" />
                <p className="text-xl font-semibold leading-none">
                    {currentPlan.plan_type}
                </p>
            </div>
            
            {isPaidPlan && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Valid from: <span className="font-semibold">{format(new Date(currentPlan.started_at!), "dd.MM.yyyy")}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Until: <span className="font-semibold">{format(new Date(currentPlan.ended_at!), "dd.MM.yyyy")}</span>
                            </p>
                        </div>
                        <div className="text-indigo-700 text-sm font-medium">
                            {/* pentru a evita valorile negative */}
                            {Math.max(0, differenceInDays(new Date(currentPlan.ended_at!), new Date()))} days active
                        </div>
                    </div>
                    
                    <button
                        onClick={handleRenewSubscription}
                        disabled={loading}
                        className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-300 rounded hover:bg-blue-200 transition"
                    >
                        {loading ? <Spinner /> : "Extend period"}
                    </button>

                    {message && (
                        <p className="text-sm text-green-500 mt-2">{message}</p>
                    )}
                </div>
            )}
            
        </div>
    )
}