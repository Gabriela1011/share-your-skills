"use client"
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/app/dashboard/admin/[id]/subscriptions/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/myComponents/Spinner";

type PlanProps = {
  currentPlanId: string;
};


export default function Plans({ currentPlanId }: PlanProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [successPlanId, setSuccessPlanId] = useState<string | null>(null);
  const router = useRouter();
  
    useEffect(() => {
      fetch("/api/subscriptions")
        .then(res => res.json())
        .then(data => {
          setSubscriptions(data);
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch", err);
          setLoading(false)
        });
    }, []);
  
    if(loading) return <Spinner />

    const handleUpdateSubscription = async (subscriptionId: string) => {
      try {
        const res = await fetch("/api/subscription_payments", {
          method: "POST",
          body: JSON.stringify({ subscriptionId }),
        })

        const result = await res.json();
        if(result.success) {
          setSuccessPlanId(subscriptionId);
          router.refresh();
        }

      } catch (err) {
        console.error(err);
      }
    }
  
  return (
      <div className="w-full flex flex-col justify-center gap-6">
          {subscriptions.map((sub) => {
          const isCurrentPlan = sub.id === currentPlanId;


          return(
              <div
                key={sub.plan_type}
                className={`w-full border rounded-lg p-6 mt-6 sm:mr-6 space-y-4 transition-shadow hover:shadow-xl ${
                  isCurrentPlan ? "border-green-500" : "border-gray-200"
                }`}
              >
                <div className="space-y-6 pb-3">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-gray-900">{sub.plan_type}</h3>
                    <p className="text-indigo-600 font-medium">{sub.recommendation}</p>
                  </div>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{sub.price}</span>
                  <span className="text-base text-gray-500 ml-1 font-medium">RON/month</span>
                </div>
                  
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-medium">Commission:</span>
                    <span className="font-bold text-indigo-600">
                        {sub.commission}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-medium">Target:</span>
                      <span className="font-bold text-indigo-600">
                        {sub.target}
                      </span>
                  </div>
                </div>
              
                <ul className="space-y-3">
                  {sub.subscription_features.map((f, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-blue-400" />
                      </span>
                      {f.features.feature}
                    </li>
                  ))}
                </ul>
                {isCurrentPlan ? (
                  <div className="mt-4 text-green-600 font-semibold text-center">
                      This plan is currently active
                  </div>
                ) : (
                  <div>
                    <Button 
                      onClick={() => handleUpdateSubscription(sub.id)}
                      className="w-full py-2 mt-4 rounded-md bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-semibold hover:shadow-xl hover:text-black"
                    >
                      Select Plan
                    </Button>
                    { sub.id === successPlanId && (
                      <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded mb-4 mt-2">
                        Subscription has been successfully activated.
                      </div>
                    )}
                  </div>
                )}
              </div>
          )
        })} 
      </div>
  );
}
