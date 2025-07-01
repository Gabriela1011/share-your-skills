export type VoucherType = "10" | "20" | "30" | "100";

export type StudentStatus = "Starter" | "Skill Climber" | "Loyal Learner" | "Master of Growth"

export type Voucher = {
    id: string;
    student_id: string;
    type: VoucherType;
    created_at: string;
}

export type Session = {
  id: string;
  status: string;
  created_at: string;
  available_slots: {
    id: string;
    date: string;
    hour_start: string;
    hour_end: string;
  };
  teacher_skills: {
    id: string;
    price: number;
    skill: {
      id: string;
      skill: string;
    };
    teacher_profile: {
      id: string;
      language: string;
      user: {
        id: string;
        first_name: string;
        last_name: string;
        profile_picture: string;
      };
    };
  };
};
