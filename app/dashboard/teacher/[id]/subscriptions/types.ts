export type PlanProps = {
  id: string;
  plan_type: string;
  price: number;
  commission: number;
  target: string;
  recommendation: string;
  started_at?: string | null;
  ended_at?: string | null;
};
