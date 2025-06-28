import { createClient } from "@/utils/supabase/server";
import VoucherProgress from "./VoucherProgress";
import BadgeCard from "./BadgeCard";

type Props = {
  params: Promise<{ id: string }>
}

export default async function StudentDashboard({ params }: Props) {
  const supabase = await createClient();

  try{
      const { id } = await params;
    
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
    
        if(user.id !==  id ){
          return <div>You do not have access to this page.</div>
        }

         if(error || !user){
          throw new Error(error?.message);
        }

        const { data: studentProfile, error: profileError } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if(profileError || !studentProfile) {
          throw new Error(profileError?.message);
        }

        

        return (
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          
            <h1 className="text-2xl font-semibold text-start">
              Welcome back, {user.first_name ?? "Learner"}!
            </h1>
            <BadgeCard status={studentProfile.status} totalPoints={studentProfile.total_points} />
            
            <div>
              <VoucherProgress totalPoints={studentProfile.total_points} />
            </div>
          </div>
        );
  } catch (err) {
    return <div>Eroare: {(err as Error).message}</div>
  }
 
  
  }
  