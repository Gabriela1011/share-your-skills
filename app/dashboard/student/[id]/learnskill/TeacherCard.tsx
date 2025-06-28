"use client";
import {
  Star,
  Clock,
  GraduationCap,
  DollarSign,
  Gift,
  ArrowRight,
  MapPin,
  Globe,
  Video,
  IdCard,
  NotebookText,
  ChartBar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TeacherCardData } from "@/app/dashboard/types";
import { useRouter, useParams } from "next/navigation";

interface TeacherCardProps {
  teacherSkills: TeacherCardData | null;
}

export function TeacherCard({ teacherSkills }: TeacherCardProps) {
  const router = useRouter();
  const params = useParams();

  const studenId = params.id;

  return (
    <Card className="bg-white shadow-md border border-gray-200 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4 justify-between relative">
          <div className="w-full">
            <Image
              src={teacherSkills?.profile_picture ?? "/default-profile.png"}
              alt="Profile"
              width={54}
              height={54}
              className="rounded-full object-cover ring-2 ring-blue-100"
            />
            <div className="pt-2 flex justify-between">
              <div>
                <p className="flex items-center gap-1">
                  <IdCard className="w-4 h-4 text-gray-400"/>
                  {teacherSkills?.full_name}
                </p>
                <p className="flex items-center gap-1">
                  <NotebookText className="w-4 h-4 text-gray-400" />
                  {teacherSkills?.skill}
                </p>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-light">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span>{teacherSkills?.category}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-light">
                  <ChartBar className="w-3 h-3 text-gray-400" />
                  <span>{teacherSkills?.level}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 text-sm text-gray-700">
                {teacherSkills?.available_online && (
                  <div className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                    <Video className="w-4 h-4" />
                    online
                  </div>
                )}
                {teacherSkills?.available_in_person && (
                  <div className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    <MapPin className="w-4 h-4" />
                    <span className="whitespace-nowrap">in-person</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute right-0">
            <div className="text-2xl font-bold text-gray-900">
              {teacherSkills?.price} 
              <span className="text-base text-gray-500 pl-1">RON</span>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">per session</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
          <p className="text-gray-600 text-sm">
            {teacherSkills?.description}
          </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
          {teacherSkills?.offers_free_first_lesson && (
            <div className="bg-green-50 text-green-700 w-full px-4 py-1 text-sm rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">First lesson is free!</span>
            </div>
          )}
        <button 
          onClick={() => router.push(`/dashboard/student/${studenId}/bookSession/${teacherSkills?.id}`)}
          className="group w-full bg-gradient-to-r from-blue-500 to-indigo-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          Book a Session
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </CardFooter>
    </Card>
  );
}

