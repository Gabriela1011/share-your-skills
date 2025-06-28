import { createClient } from "@/utils/supabase/server";
import ActivePlan from "./ActivePlan";
import Plans from "./Plans";
import getActivePlan from "./getActivePlan";
import { PlanProps } from "./types";


export default async function TeacherSubscriptions() {
  const supabase = await createClient();
      
  const { data: {user}, error } = await supabase.auth.getUser();
  if(!user || error){
    console.error("User does not exist", error?.message);
    return null;
  } 
  
  const currentPlan = await getActivePlan(user.id);
  if(!currentPlan) {
    return <div className="text-6xl text-red-500">Failed to load subscription info.</div>
  }

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-sm">
      <ActivePlan currentPlan={currentPlan} />
      <h2 className="text-xl font-semibold mt-6">
        Choose Your Subscription Plan
      </h2>
      <Plans currentPlanId={currentPlan.id}/>
    </div>
  );
}
