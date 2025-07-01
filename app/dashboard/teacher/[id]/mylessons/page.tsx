import AddTimeSlot from "@/components/myComponents/AddTimeSlot";
import getTeacherSessions from "../sessionscalendar/getTeacherSessions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/server";
import getSlots from "../getSlots";
import DialogAddTimeSlot from "@/components/myComponents/DialogAddTimeSlot";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Mail, User } from "lucide-react";
import { SessionStatus } from "@/app/dashboard/types";

const statusColor: Record<SessionStatus, string> = {
  scheduled: "bg-blue-500",
  cancelled: "bg-red-500",
  cancellation_with_refund: "bg-orange-500",
  completed: "bg-green-500",
}

export default async function TeacherLessonsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    console.error("user doesnt's exist");
    return;
  }

  //obtinem id ul profesorului din teacher_profiles
  const { data: profile, error: profileError} = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if(profileError || !profile) {
    console.error('Error retrieving teacherID', profileError);
    return;
  }

  const sessions = await getTeacherSessions();
  // Sortăm sesiunile după data și ora slotului
  sessions.sort((a, b) => {
    const dateA = new Date(`${a.available_slots?.date}T${a.available_slots?.hour_start}`);
    const dateB = new Date(`${b.available_slots?.date}T${b.available_slots?.hour_start}`);
    
    return dateA.getTime() - dateB.getTime();
  });

  const slots = await getSlots(profile.id);

  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Sessions</h2>
      
      <div className="mb-6">
        <DialogAddTimeSlot slots={slots} />
      </div>

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-gray-300 rounded-2xl p-5 shadow-md"
            >
              
            <span
              className={` px-1 py-0.5 rounded text-white text-sm ${statusColor[session.status as SessionStatus]}`}
            >
              {session.status}
            </span>
             

            
                <div className="flex flex-col justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(parseISO(session.available_slots?.date), "dd.MM.yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {session.available_slots?.hour_start?.slice(0, 5)} -{" "}
                    {session.available_slots?.hour_end?.slice(0, 5)}
                  </div>
                </div>
              
              <div className="mt-2">
                <p className="text-xs text-gray-400">Student:</p>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {session.student_profiles?.users?.full_name}
                </div>
               
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Mail size={14} />
                  {session.student_profiles?.users?.email}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-400">Skill:</p>
                <p>{session.teacher_skills?.skills?.skill}</p>
                
              </div>

              <p className="text-sm text-gray-400 mt-2">Price: {session.teacher_skills?.price} RON</p>

              {session.status === "completed" && (
                <Popover>
                  <PopoverTrigger className="border rounded-md px-1 text-sm bg-blue-300 hover:bg-indigo-200">Give Feedback</PopoverTrigger>
                  <PopoverContent>
                    <Textarea placeholder="Write feedback..." />
                    {/* <button onClick={handleSendFeedback}> */}
                      <button>
                        Send
                      </button>
                  </PopoverContent>
                </Popover>
              )}

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
