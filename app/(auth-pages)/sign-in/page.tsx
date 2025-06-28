"use client"

import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const params = useSearchParams();
  const error = params.get("error");
  const success = params.get("success");
  const messageRaw = params.get("message");

  let message: Message | undefined;

  if (error) {
    message = { error: decodeURIComponent(error) };
  } else if (success) {
    message = { success: decodeURIComponent(success) };
  } else if (messageRaw) {
    message = { message: decodeURIComponent(messageRaw) };
  }
  
  return (
    <>
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          {/* <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link> */}
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
      </div>
    </form>
    
    {message && <FormMessage message={ message } />}
    </>
  );
}
