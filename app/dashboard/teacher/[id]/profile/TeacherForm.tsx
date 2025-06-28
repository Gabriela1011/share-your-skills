'use client'

import ProfileHeader from "./ProfileHeader";
import { saveTeacherInfo } from "./actions";
import SkillSelector from "./SkillSelector";
import { Button } from "@/components/ui/button";
import { Skill, TeacherProfile } from "@/app/dashboard/types";
import { useToast } from "@/hooks/use-toast";
import { useActionState, useEffect } from "react";
import Spinner from "@/components/myComponents/Spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeacherForm({ profileData, skillsData }:{profileData:TeacherProfile | null,skillsData:Skill[]}) {
    //creez cate un useState pt campurile de select language si freefirstlesson
    const [language, setLanguage] = useState(profileData?.language || "");
    const [freeLesson, setFreeLesson] = useState(profileData?.offers_free_first_lesson ? "Yes" : "No")

    const router = useRouter();
    const [state, action, isPending] = useActionState(saveTeacherInfo, null)
    const {toast} = useToast()

    useEffect(() => {
      if(profileData?.language)
        setLanguage(profileData.language);

      setFreeLesson(profileData?.offers_free_first_lesson ? "Yes" : "No");
    }, [profileData?.language, profileData?.offers_free_first_lesson]);

    useEffect(() => {
      if (state?.success === true) {
        toast({
          title: "Success!",
          description: "Teacher profile saved successfully"
        });
        router.push(state.redirectTo);
        router.refresh();
      }
    }, [state, toast]);
    
    return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <form action={action} className="space-y-6">
        <ProfileHeader />
        <h2 className="text-xl font-semibold mb-6 text-primary-foreground">
          Personal Information
        </h2>
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              defaultValue={profileData?.bio || ""}
              className="w-full mt-1 rounded-md bg-white shadow-md px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              rows={4}
              placeholder="Tell students about yourself..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Teaching Experience (years)
            </label>
            <input
              type="number"
              name="experience_years"
              defaultValue={profileData?.experience_years || 0}
              min={0}
              step={1}
              className="mt-1 w-full rounded-md bg-white shadow-md px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Teaching Language
            </label>
            <select
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 w-full rounded-md bg-white shadow-md px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            >
              <option value="English">English</option>
              <option value="Romanian">Romanian</option>
              <option value="English&Romanian">English&Romanian</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Teaching Preferences</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                name="available_online"
                defaultChecked={profileData?.available_online || false}
                className=" rounded"
              />
              <span>Online Teaching</span>
            </label>

            <label className="flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                name="available_in_person"
                defaultChecked={profileData?.available_in_person || false}
                className="rounded"
              />
              <span>In-Person Teaching</span>
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              First Lesson Free?
            </label>
            <select
              name="offers_free_first_lesson"
              value={freeLesson}
              onChange={(e) => setFreeLesson(e.target.value)}
              className="mt-1 w-full rounded-md bg-white shadow-md px-4 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <SkillSelector initialSkills={skillsData} />
        <Button type="submit" className="w-full md:w-auto">
          Save Profile {isPending && <Spinner/>}
        </Button>
      </form>
    </div>
  );

}

