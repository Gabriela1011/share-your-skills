import { createClient } from "@/utils/supabase/server";


export default async function getTeacherSessions() {
  const supabase = await createClient();

  const { data: {user}, error: userError } = await supabase.auth.getUser();
  if(!user) return [];

  //obtinem id ul profesorului din teacher_profiles
  const { data: teacherProfile, error: teacherError } = await supabase
    .from('teacher_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();
 
  if(!teacherProfile) return [];

  

  const { data: sessions, error: sessionError } = await supabase
    .from('sessions')
    .select(`
      *,
      student_profiles(
        users (
          full_name,
          profile_picture,
          email
        )  
      ),
      teacher_skills(*, skills(*)),
      available_slots(*)
    `)
    .eq("teacher_id", teacherProfile.id)
    .order('created_at', {ascending: true});
      
    console.log("sessionsss", sessions)

  if(sessionError){
    console.error('Eroare la fetch sessions:', sessionError);
    return [];
  }

  return sessions;
}