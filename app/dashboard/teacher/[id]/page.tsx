import { createClient } from "@/utils/supabase/server";
import { Progress } from "@radix-ui/react-progress";
type Props = {
  params: Promise<{ id: string }>
}

export default async function TeacherDashboard({ params }: Props) {
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
            <h1>Bun venit, {user.first_name ?? "Firstname"}!</h1>
            <p>Email: {user.email ?? "Email"}</p>
          </div>
        );
  } catch (err) {
    return <div>Eroare: {(err as Error).message}</div>
  }
  
  
  }
  