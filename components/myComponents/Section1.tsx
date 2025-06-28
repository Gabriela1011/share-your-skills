import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";


export default function Section1() {
  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-center lg:justify-between gap-10">
        <div className="flex-1 gap-10">
          <h1 className="text-3xl font-extrabold tracking-tight space-y-2">
            <span>Because </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">
              Knowledge
            </span>
            <span className="block">Is Meant To Be</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">
              Shared
            </span>
          </h1>

          <div className="flex justify-center mt-6">
            <Button variant={"default"}>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 bg-white/60 rounded-xl p-6 shadow-lg mt-8">
          <div className="w-[120px] h-auto text-center">
            <Image
              src="/images/teaching.svg"
              alt="Teaching"
              width={500}
              height={500}
              className="mx-auto"
            />
            <p className="text-base font-semibold text-foreground mt-2">
              Share Knowledge
            </p>
          </div>
          <div className="w-[120px] h-auto text-center">
            <Image
              src="/images/learning.svg"
              alt="Learning"
              width={500}
              height={500}
              className="mx-auto"
            />
            <p className="text-base font-semibold text-foreground mt-2">
              Explore Skills
            </p>
          </div>
          <div className="w-[120px] h-auto text-center">
            <Image
              src="/images/education.svg"
              alt="Education"
              width={500}
              height={500}
              className="mx-auto"
            />
            <p className="text-base font-semibold text-foreground mt-2">
              Start Learning
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
