"use client";

import { UserIcon, UploadIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Spinner from "@/components/myComponents/Spinner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";
import Image from "next/image";


export default function ProfileHeader() {
  const [uploading, setUploading] = useState(false); 
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  ); //stocheaza url-ul pozei
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      if (!userId) return;

      try {
        const response = await fetch(`/api/profile_picture/${userId}`);
        const data = await response.json();

        if (data.profile_picture) {
          setProfilePictureUrl(data.profile_picture);
        }
      } catch (error) {
        console.error("Error fetching profile picture: ", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const supabase = createClient();

    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      const userId = user?.id;
      if (!userId) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/profile_picture/${userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.profile_picture) {
        setProfilePictureUrl(data.profile_picture);
      }
    } catch (error) {
      console.error("Error uploading profile picture: ", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-6">
        <div className="relative">
          {uploading ? (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <Spinner />
            </div>
          ) : profilePictureUrl ? (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild className="cursor-pointer">
                <Image
                  src={profilePictureUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full"
                />
              </DialogTrigger>

              <DialogOverlay className="fixed inset-0 bg-blackground z-50" />

              <DialogContent className="p-0 z-50 flex items-center justify-center">
                <DialogTitle className="sr-only">Profile</DialogTitle>

                <Image
                  src={profilePictureUrl}
                  alt="Profile Large"
                  width={560}
                  height={500}
                  className="max-w-full max-h-full rounded-lg shadow-md"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <UserIcon className="w-11 h-11 text-gray-400" />
            </div>
          )}

          <label htmlFor="profile-upload" className="absolute bottom-0 right-0">
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <div className="cursor-pointer absolute bottom-0 right-0 bg-blue-500 text-white p-3 rounded-full shadow transition hover:bg-blue-600 hover:scale-105 hover:shadow-lg">
              <UploadIcon className="w-4 h-4" />
            </div>
          </label>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary-foreground">
            Profile Picture
          </h2>
          <p className="text-primary-foreground text-sm">Upload a photo</p>
        </div>
      </div>
    </div>
  );
}
