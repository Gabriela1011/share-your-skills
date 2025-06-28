import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminDashboard({ params }: Props) {
  const supabase = await createClient();

  //fetch user data by id
  try{
      const { id } = await params;
    
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
    
        if(user.id !==  id ){
          
          return <div>Nu ai acces la aceasta pagina</div>
        }

        if(error || !user){
          throw new Error("user not found");
        }
    
        return (
          <div>
            
          </div>
        );
  } catch (err) {
    return <div>Eroare: {(err as Error).message}</div>
  }
  
  
  }
  