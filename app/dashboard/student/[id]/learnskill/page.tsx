import { createClient } from "@/utils/supabase/server";
import { TeacherCard } from "./TeacherCard";
import { DatabaseSkill, TeacherCardData } from "@/app/dashboard/types";

type RawTeacherSkill = {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  price: number;
  skills: {
    skill: string;
    category: string;
  };
  teacher_profiles: {
    offers_free_first_lesson: boolean;
    available_online: boolean;
    available_in_person: boolean;
    language: string;
    users: {
      full_name: string;
      profile_picture: string | null;
    };
  };
};

export default async function LearnANewSkill() {
    const supabase = await createClient();

    let teacherSkillsData: TeacherCardData[] | null = null;
    const { data: rawData, error } = await supabase
        .from("teacher_skills")
        .select(`
            id,
            level,
            description,
            price,
            skills (
                skill,
                category
                ), 
            teacher_profiles (
                offers_free_first_lesson,
                available_online,
                available_in_person,
                language,
                users (
                    full_name,
                    profile_picture
                )
            )
        `);
    if(error) {
        console.error("Eroare la fetch teacher_skills:", error);
        return (
            <div className="p-6 text-red-600">
                <h1>Oops! A apărut o eroare la încărcarea datelor profesorilor.</h1>
            </div>
        );
    }
    const teacherSkills = rawData as unknown as RawTeacherSkill[];
    if(teacherSkills) {
        teacherSkillsData = teacherSkills.map((ts) => {
         
          return {
            id: ts.id,
            level: ts.level,
            description: ts.description,
            price: ts.price,
            skill: ts.skills.skill,
            category: ts.skills.category,
            offers_free_first_lesson: ts.teacher_profiles.offers_free_first_lesson,
            available_online: ts.teacher_profiles.available_online,
            available_in_person: ts.teacher_profiles.available_in_person,
            language: ts.teacher_profiles.language,
            full_name: ts.teacher_profiles.users.full_name,
            profile_picture: ts.teacher_profiles.users.profile_picture,
          }
        })
    }
    
    return (
        <div className="min-h-screen w-full">
            <div className="max-w-7xl mx-auto px-4 space-y-8">
                 <h1 className="text-3xl font-bold text-primary-foreground">
                    Looking to learn something new? Find a teacher!
                </h1>
                <div className="grid lg:grid-cols-2 gap-6">
                    {teacherSkillsData?.map((teacherSkill) => (
                        <TeacherCard key={teacherSkill.id} teacherSkills={teacherSkill} />
                    ))}
                </div>
            </div>
        </div>
    );
}
