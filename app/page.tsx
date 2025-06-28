import Section1 from "@/components/myComponents/Section1";
import Card from "@/components/myComponents/card";
import { UserRoundPen, BookOpenCheck, DollarSign } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <Section1 />

      <section className="mt-16 w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            title="Learn New Skills"
            description="Connect with skilled instructors who offer personalized guidance on various topics, both online and in person."
            icon={
              <BookOpenCheck size={40} color="#566a99" strokeWidth={1.75} />
            }
          />

          <Card
            title="Occasional Discounts"
            description="Students can receive vouchers for discounts on sessions with teachers."
            icon={<DollarSign size={40} color="#566a99" strokeWidth={1.75} />}
          />

          <Card
            title="Profit as an instructor"
            description="Teach on the platform and earn money through subscriptions."
            icon={<UserRoundPen size={40} color="#566a99" strokeWidth={1.75} />}
          />
        </div>
      </section>
    </div>
  );
}
