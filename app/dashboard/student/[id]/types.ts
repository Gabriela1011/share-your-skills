export type VoucherType = "10" | "20" | "30" | "100";

export type StudentStatus = "Starter" | "Skill Climber" | "Loyal Learner" | "Master of Growth"

export type Voucher = {
    id: string;
    student_id: string;
    type: VoucherType;
    created_at: string;
}