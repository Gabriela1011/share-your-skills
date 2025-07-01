import { createClient } from "@/utils/supabase/server";
import { Session } from "../types";
import SelectSlot from "../bookSession/[teacherSkillId]/SelectSlot";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CancelSessionDialog from "./CancelSessionDialog";
import { sl } from "date-fns/locale";
import Image from "next/image";

export default async function MyLessons() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    const { data: studentProfile, error: profileError } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();
    
     const { data, error: studentError } = await supabase
        .from("sessions")
        .select(`
            id,
            status,
            created_at,
            available_slots!slot_id (
                id,
                date,
                hour_start,
                hour_end
                ),
                teacher_skills!teacher_skill_id (
                id,
                price,
                skill:skill_id (
                    id,
                    skill
                ),
                teacher_profile:teacher_id (
                    id,
                    language,
                    user:user_id (
                    id,
                    first_name,
                    last_name,
                    profile_picture
                    )
                )
            )
        `)
        .eq("student_id", studentProfile?.id)
        .order("created_at", { ascending: false });

        const studentSessions = data as Session[] | null;

    return (!studentSessions || studentSessions.length === 0 
        ? <div className="w-full h-96 relative"><Image src="/images/no-sessions.png" alt="no sessions" fill style={{ objectFit: "contain" }}/></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentSessions.map((session) => {
            
            const slot = session.available_slots;
            const skill = session.teacher_skills.skill.skill;
            const teacher = session.teacher_skills.teacher_profile.user;
            const profile = session.teacher_skills.teacher_profile;

            return (
            <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col gap-4"
            >
                <div className="flex items-center gap-4">
                <img
                    src={teacher.profile_picture}
                    alt={`${teacher.first_name} ${teacher.last_name}`}
                    className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                    <h2 className="text-lg font-semibold">
                    {teacher.first_name} {teacher.last_name}
                    </h2>
                    <p className="text-sm text-gray-500">{profile.language}</p>
                </div>
                </div>

                <div>
                <p className="text-sm text-gray-500 mb-1">Skill</p>
                <p className="text-md font-medium">{skill}</p>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                <div>
                    <p className="font-medium text-gray-800">Date</p>
                    <p>{slot.date}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-800">Time</p>
                    <p>
                    {slot.hour_start} - {slot.hour_end}
                    </p>
                </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {session.status}
                </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Price</span>
                <span className="font-bold text-green-600">{session.teacher_skills.price} ron</span>
                </div>

               <Popover>
                    <PopoverTrigger>Book another session</PopoverTrigger>
                    <PopoverContent>
                        <SelectSlot teacherSkillId={session.teacher_skills.id} studentId={studentProfile?.id} price={session.teacher_skills.price} revalidate/>
                    </PopoverContent>
                </Popover> 

               <CancelSessionDialog 
                    sessionId={session.id}
                    date={slot.date}
                    hourStart={slot.hour_start}
               />

                
            </div>
            );
        })}
        </div>)
        
    
}