import { createClient } from "@/utils/supabase/server";
import PaymentsTable from "./PaymentsTable";

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminDashboard({ params }: Props) {
  const supabase = await createClient();

  try{
      const { id } = await params;
    
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
    
        if(user.id !==  id ){
          return <div>You don't have access.</div>
        }

        if(error || !user){
          throw new Error("user not found");
        }
    
        return (
          <div className="">
            <h1 className="mb-2 text-center font-semibold text-xl">All Session Payments</h1>
            <PaymentsTable />
          </div>
        );
  } catch (err) {
    return <div>Eroare: {(err as Error).message}</div>
  }
  
  
  }
  