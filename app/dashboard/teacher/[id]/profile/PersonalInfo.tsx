import { createClient } from "@/utils/supabase/server";
import { TeacherProfile, Skill, DatabaseSkill } from "@/app/dashboard/types";
import TeacherForm from "./TeacherForm";

export default async function PersonalInfo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  //preluam datele si skill urile profesorului
  let profileData: TeacherProfile | null = null;
  let skillsData: Skill[] = [];

  if(!userId)
    console.log("Error userId");
  else{
    const { data: profile, error: profileError } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    

    if(!profileError && profile) {
      profileData = {
        bio: profile.bio,
        offers_free_first_lesson: profile.offers_free_first_lesson,
        experience_years: profile.experience_years,
        available_online: profile.available_online,
        available_in_person: profile.available_in_person,
        language: profile.language
      };
    }

     const { data: skills, error: skillsError } = await supabase
      .from("teacher_skills")
      .select("level, description, price, skills(id, skill, category)")
      .eq("teacher_id", profile?.id);


      if(!skillsError && skills) {
        skillsData = skills.map((sk) => {
          const skill = sk.skills as unknown;
          const finalSkill = skill as DatabaseSkill;
          //aveam eroare daca nu converteam mai intai la unknown si dupa la databaseskill
         
          return {
            id: finalSkill?.id,
            skill: finalSkill?.skill,
            category: finalSkill?.category,
            level: sk.level,
            description: sk.description,
            price: sk.price
          }
        })
      }

  }
   
  return(<TeacherForm profileData={profileData} skillsData={skillsData}/>)
}
