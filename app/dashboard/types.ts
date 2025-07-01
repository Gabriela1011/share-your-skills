//skills din baza de date
//pt teacher profile
//categorii de skill uri pt checkbox
export type SkillCategory =
  | "Languages"
  | "Technology & Programming"
  | "Academic Subjects"
  | "School Subjects"
  | "Business & Finance"
  | "Sport & Health"
  | "Music & Arts"
  | "Others";


  //skill individual din tabela skills
export interface DatabaseSkill {
  id: string;
  skill: string;
  category: SkillCategory;
}

//teacher_skills din baza de date
export interface TeacherSkill {
  id: string;
  teacher_id: string;
  skill_id: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  price: number;
  skills: DatabaseSkill;
}


//pt formularul din skillselector
export interface Skill {
  id?: string; //optional, doar daca skillul exista deja in db, id-ul din skills
  skill: string;
  category: SkillCategory;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  price: number;
}

// types.ts
export interface TeacherSkillData {
  teacher_id: string;
  skill_id: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
}



//tabela teacher_profiles doar pt formular
//nu are toate coloanele din tabela
export interface TeacherProfile {
  bio: string;
  offers_free_first_lesson: boolean;
  experience_years: number;
  available_online: boolean;
  available_in_person: boolean;
  language: string;
}

export interface TeacherProfileWithId extends TeacherProfile{
  user_id: string;
}


//pt admin dashboard, sa vada toate sesiunile de invatare
export type SessionStatus = 'scheduled' | 'cancelled' | 'cancellation_with_refund' | 'completed'

export type Session = {
  id: string
  teacher_id: string
  student_id: string
  teacher_skill_id: string
  slot_id: string

  date_time: string
  duration_minutes: number
  price: number
  is_free: boolean
  status: SessionStatus
  created_at: string

  available_slots: {
    id: string
    date: string
    hour_start: string
    hour_end: string
    is_booked: boolean
  }

  student_profiles: {
    id: string
    user_id: string
    total_points: number
    about: string | null
    status: string
    created_at: string
    users: {
      full_name: string
    }
  }

  teacher_skills: {
    id: string
    level: string
    description: string
    price: number
    skills: {
      id: string
      skill: string
      category: string
    }
    teacher_profiles: {
      user_id: string
      users: {
        full_name: string
      }
    }
  }
}

export interface TeacherCardData {
  id: string; // id-ul din teacher_skills
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  price: number;

  // din relația cu tabelul "skills"
  skill: string;
  category: string;

  // din relația cu tabelul "teacher_profiles"
  
  offers_free_first_lesson: boolean;
  available_online: boolean;
  available_in_person: boolean;
  language: string;

  // din relația cu tabelul "users"
  full_name: string;
  profile_picture: string | null;
}




//PT INTEROGARE PT ADMIN
//  .select(`
//   *,
//   available_slots(*),
//   student_profiles(
//     *,
//     users(full_name)
//   ),
//   teacher_skills(
//     *,
//     skills(*),
//     teacher_profiles(
//       user_id,
//       users(full_name)
//     )
//   )
// `)
export type RawSubscription = {
  subscriptions: { plan_type: "FREE" | "BASIC" | "PRO"; }
}