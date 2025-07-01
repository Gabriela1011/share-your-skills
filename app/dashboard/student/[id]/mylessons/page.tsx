import { createClient } from "@/utils/supabase/server";
import { Session } from "../types";
import SelectSlot from "../bookSession/[teacherSkillId]/SelectSlot";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CancelSessionDialog from "./CancelSessionDialog";
import { parseISO, compareAsc, format } from "date-fns";
import Image from "next/image";
import { ArrowRight, BookText, Globe } from "lucide-react";

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

        const studentSessions = data as Session[] | null;

       if (studentSessions) {
            studentSessions.sort((a, b) => {
                const dateA = a.available_slots?.date;
                const hourA = a.available_slots?.hour_start;
                const dateB = b.available_slots?.date;
                const hourB = b.available_slots?.hour_start;

                if (!dateA || !hourA || !dateB || !hourB) return 0;

                const fullDateA = parseISO(`${dateA}T${hourA}`);
                const fullDateB = parseISO(`${dateB}T${hourB}`);

                return compareAsc(fullDateA, fullDateB);
            });
        }


    return (!studentSessions || studentSessions.length === 0 
        ? <div className="w-full h-96 relative"><Image src="/images/no-sessions.png" alt="no sessions" fill style={{ objectFit: "contain" }}/></div>
        : <div className="grid grid-cols-2 gap-6">
        {studentSessions.map((session) => {
            
            const slot = session.available_slots;
            const skill = session.teacher_skills.skill.skill;
            const teacher = session.teacher_skills.teacher_profile.user;
            const profile = session.teacher_skills.teacher_profile;

            return (
            <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col gap-3"
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
                        <div className="flex items-center gap-1">
                            <Globe size={14} strokeWidth={1.25}/>
                            <p className="text-sm text-gray-500">{profile.language}</p>
                        </div>
                        
                    </div>
                </div>

                <div className="flex gap-1 items-center">
                    <BookText size={16}/>
                    <p className="text-md font-medium">{skill}</p>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <div>
                        <p className=" text-gray-800 text-xs">
                            Date
                        </p>
                        <p className="font-medium">{format(parseISO(slot.date), "dd.MM.yyyy")}</p>
                    </div>
                    <div>
                        <p className=" text-gray-800 text-xs">Time</p>
                        <p className="font-medium">
                            {format(parseISO(`${slot.date}T${slot.hour_start}`), "HH:mm")} - {format(parseISO(`${slot.date}T${slot.hour_end}`), "HH:mm")}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {session.status}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="font-bold text-green-600">
                        {session.teacher_skills.price} 
                        <span className="text-xs pl-0.5">RON</span>
                    </span>
                </div>

               <Popover>
                    <PopoverTrigger className="group w-full bg-gradient-to-r from-blue-500 to-indigo-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
                        Book another session
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </PopoverTrigger>
                    <PopoverContent>
                        <SelectSlot teacherSkillId={session.teacher_skills.id} studentId={studentProfile?.id} price={session.teacher_skills.price} revalidate/>
                    </PopoverContent>
                </Popover> 

                {(session.status === 'scheduled' || session.status === 'completed') && 
                    <CancelSessionDialog 
                        sessionId={session.id}
                        date={slot.date}
                        hourStart={slot.hour_start}
                    />
                }
                
            </div>
            );
        })}
        </div>)
        
    
}