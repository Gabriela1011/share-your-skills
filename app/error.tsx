'use client';

import { Button } from "@/components/ui/button";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
        <div className={`flex items-center justify-center min-h-screen bg-background text-foreground text-center space-y-6 ${plusJakartaSans.variable}`}>
          <h1 className="text-4xl font-bold text-destructive">Something went wrong!</h1>
          <p className="text-muted-foreground">
            We're working to fix the problem. You can try again or return to the homepage.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => reset()}
              variant={"outline"}
              className="border-black"
            >
              Try Again
            </Button>

            <Button
              variant={"default"}
            >
              Go Home
            </Button>
          </div>
        </div>
  );
}
