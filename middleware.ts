import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";
import path from "path";
import { Rewind } from "lucide-react";
import { url } from "inspector";

export async function middleware(request: NextRequest) {
  
  const pathname = request.nextUrl.pathname;
  const res = await updateSession(request);
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  if (pathname === "/sign-in" && !user) {
    return NextResponse.next();
  }

  //Dacă utilizatorul e deja logat și încearcă să acceseze /sign-in, îl redirecționăm
  if((pathname === "/sign-in" || pathname === "/") && user)
  {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  if(!user)
  {
    if(pathname.startsWith("/dashboard") || pathname.startsWith("/protected"))
      return NextResponse.redirect(new URL("/sign-in", request.url));
    else return (pathname !== "/") ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();;
  }
  
  //Verifica daca utilizatorul este blocat
  const { data: userData, error } = await supabase
    .from("users")
    .select("is_blocked")
    .eq("id", user.id)
    .single();
  
  if(userData?.is_blocked) {
    return NextResponse.redirect(new URL("/blocked", request.url));
    //	URL complet al cererii (protocol + domeniu + cale)
  }

  const role = user.user_metadata?.role;
  console.log("ROLUL UTILIZATORULUI ESTE:", role);
    
  //restrictie admin
  if(pathname.startsWith("/dashboard/admin") && role !== "admin"){
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  //rest teacher
  if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // restricție pentru student
  if (pathname.startsWith("/dashboard/student") && role !== "student") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    const parts = pathname.split("/");
    const userIdInUrl = parts[3]; // id-ul din URL dacă există

     //  Dacă userul este student, teacher sau admin, și există userId în URL, 
    // verificăm dacă id-ul din URL == user.id (ca să nu vadă profilul altuia)
    if (userIdInUrl && userIdInUrl !== user.id) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }


  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/protected/:path*",
    "/sign-in",
    "/", //pt redirect daca user ul este 
  ],
};
