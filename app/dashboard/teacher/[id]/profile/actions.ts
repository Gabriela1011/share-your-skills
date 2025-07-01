"use server";

import { createClient } from "@/utils/supabase/server";
import { Skill, TeacherSkillData, SkillCategory, TeacherProfileWithId } from "@/app/dashboard/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getSkillsFromFormData(formData: FormData): Skill[] {
  const ids = formData.getAll("skill_id") as string[];
  const categories = formData.getAll("category") as SkillCategory[];
  const skillNames = formData.getAll("skill") as string[];
  const descriptions = formData.getAll("description") as string[];
  const levels = formData.getAll("level") as (
    | "beginner"
    | "intermediate"
    | "advanced"
  )[];
  const priceRaw = formData.getAll("price") as string[];
  const prices = priceRaw.map((p) => parseInt(p, 10) || 0);


  if (
    categories.length !== skillNames.length ||
    skillNames.length !== descriptions.length ||
    descriptions.length !== levels.length ||
    levels.length !== prices.length
  ) {
    throw new Error(
      "Mismatch between number of categories, skills, descriptions, and levels."
    );
  }

  return categories.map((category, index) => ({
    id: ids[index] || undefined,
    skill: skillNames[index].trim(),
    category: category,
    description: descriptions[index].trim(),
    level: levels[index],
    price: prices[index]
  }));
}



function validateSkills(skills: Skill[]): boolean {
  return skills.every((skill) => {
    return (
      typeof skill.skill === "string" &&
      skill.skill.trim().length > 0 &&
      typeof skill.category === "string" &&
      skill.category.trim().length > 0 &&
      typeof skill.description === "string" &&
      skill.description.trim().length > 0 &&
      ["beginner", "intermediate", "advanced"].includes(skill.level)
    );
  }); 
}

export async function saveTeacherInfo(prev:unknown,formData: FormData) {
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  if (!userId) {
    console.log("Error userId ");
    return;
  }

  try {
    //extragem datele din formular
    const bio = formData.get("bio") as string;

    const experienceYearsRaw = formData.get("experience_years");
    const experienceYears = experienceYearsRaw ? parseInt(experienceYearsRaw.toString(), 10) : 0;

    const language = formData.get("language") as string;

    const availableOnlineValue = formData.get("available_online");
    const availableOnline = availableOnlineValue === "on" ? true : false;

    const availableInPersonValue = formData.get("available_in_person");
    const availableInPerson = availableInPersonValue === "on" ? true : false;

    const offersFreeFirstLessonValue = formData.get("offers_free_first_lesson");
    const offersFreeFirstLesson = offersFreeFirstLessonValue === "Yes" ? true : false;

    const profileData: TeacherProfileWithId = {
      user_id: userId,
      bio: bio,
      offers_free_first_lesson: offersFreeFirstLesson,
      experience_years: experienceYears,
      available_online: availableOnline,
      available_in_person: availableInPerson,
      language: language,
    };

    const { data: profile, error: profileError } = await supabase
      .from("teacher_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select("*")
      .single();

    if (profileError) throw profileError;
    if(!profile) new Error("Failed to save profile data.");


    const skills = getSkillsFromFormData(formData);

    if(!validateSkills(skills)) {
      throw new Error("Invalid skill data. Please check your inputs.");
    }


    for(const skill of skills) {
      let skillId: string;

      //adaugare de skill uri noi care nu exista deja in baza de date
      if(skill.id){
        skillId = skill.id;
      } else {
        const { data: existing, error: findError } = await supabase
          .from("skills")
          .select("id")
          .eq("skill", skill.skill)
          .eq("category", skill.category)
          .maybeSingle();

        if(findError) throw findError;

        if(existing){
          skillId = existing.id;
        }else {
          const { data: inserted, error: insertError } = await supabase
            .from("skills")
            .insert({ skill: skill.skill, category: skill.category })
            .select("id")
            .single();
          
          if (insertError || !inserted) throw insertError || new Error("Skill insert failed");
            skillId = inserted.id;
        }
      }


      const { data: existingTeacherSkill } = await supabase
        .from("teacher_skills")
        .select("id")
        .eq("teacher_id", profile.id)
        .eq("skill_id", skillId)
        .maybeSingle();

      if(existingTeacherSkill) {
        await supabase
          .from("teacher_skills")
          .update({
            description: skill.description,
            level: skill.level,
            price: skill.price
          })
          .eq("id", existingTeacherSkill.id);
      } else {
          await supabase
            .from("teacher_skills")
            .insert({
              teacher_id: profile.id,
              skill_id: skillId,
              description: skill.description,
              level: skill.level,
              price: skill.price
            });
        }
      }
    

    revalidatePath(`/dashboard/teacher/${userId}/profile`);
    return {
      success:true, 
      message:"Teacher profile saved successfully",
      redirectTo: `/dashboard/teacher/${userId}/profile`
    }
  } catch (error) {
    //todo: handle success:false
    console.error("Error saving teacher data ", error);
    return {
      success:false, 
      message:"eroare la salvare",
      redirectTo: `/error`
    }
    
  }
}
