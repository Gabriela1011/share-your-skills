import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .select("profile_picture")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile picture:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile picture" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile_picture: data.profile_picture });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    //obtinr userId din url
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      console.error("User ID is missing");
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("File is missing");
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    //upload fisier in supabase storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    //salveaza url ul in baza de date

    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_picture: publicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile picture:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile picture" },
        { status: 500 }
      );
    }

    console.log("Profile picture updated:", publicUrl);
    return NextResponse.json({ profile_picture: publicUrl });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error tartsagvs" },
      { status: 500 }
    );
  }
}
