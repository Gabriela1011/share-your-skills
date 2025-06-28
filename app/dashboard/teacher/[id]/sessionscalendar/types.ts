import { SessionStatus, DatabaseSkill } from "@/app/dashboard/types";

export type StudentStatus =
  | "Starter"
  | "Skill Climber"
  | "Loyal Learner"
  | "Master of Growth";

// export type StudentProfilesExtended = {
//     id: string; //id ul profilului de student
//     user_id: string;
//     total_points: number;
//     about: string;
//     status: StudentStatus;
//     full_name: string;
//     profile_picture: string | null,
//     email: string;
// }


export type TeacherCalendarSession = {
  id: string;
  teacher_id: string;
  student_id: string;
  teacher_skill_id: string;
  slot_id: string;
  date_time: string;
  price: number;
  is_free: boolean;
  status: SessionStatus;

  student_profiles: {
    users: {
      full_name: string;
      profile_picture: string;
      email: string;
    }
  }

  teacher_skills: {
    level: "beginner" | "intermediate" | "advanced";
    description: string;
    price: number;
    skills: DatabaseSkill
  };

  available_slots: {
    date: string;
    hour_start: string;
    hour_end: string;
    is_booked: boolean;
  }
};

