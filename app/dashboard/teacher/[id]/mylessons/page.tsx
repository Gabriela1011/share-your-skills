import AddTimeSlot from "@/components/myComponents/AddTimeSlot";
import getTeacherSessions from "../sessionscalendar/getTeacherSessions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/server";
// import { statusColor } from "../sessionscalendar/TeacherCalendar";
// import { SessionStatus } from "@/app/dashboard/types";


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
//trebuie sloturile din baza de date
//vezi select slot de la student


  const sessions = await getTeacherSessions();
  console.log("Teacher sessions din supabase:", sessions);

  
  return (
    <div>
      {/* <AddTimeSlot slots={} /> */}
      <h2 className="text-xl font-semibold mb-4">My Sessions</h2>

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="border bg-white border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <p><strong>Status:</strong>
                {/* <span
                  className={`text-white px-2 py-1 rounded ${statusColor[session.status as SessionStatus]}`}
                > */}
                  {session.status}
                {/* </span> */}
               
              </p>
              <p><strong>Created at:</strong> {new Date(session.created_at).toLocaleString()}</p>

              <div className="mt-2">
                <p className="font-semibold">Student:</p>
                <p>{session.student_profiles?.users?.full_name}</p>
                <p>{session.student_profiles?.users?.email}</p>
              </div>

              <div className="mt-2">
                <p className="font-semibold">Skill:</p>
                <p>{session.teacher_skills?.skills?.skill}</p>
                <p>Price: ${session.teacher_skills?.price}</p>
              </div>

              <div className="mt-2">
                <p className="font-semibold">Time Slot:</p>
                <p>
                  {session.available_slots?.date} | {session.available_slots?.hour_start} - {session.available_slots?.hour_end}
                </p>
              </div>

              {session.status === "completed" && (
                <Popover>
                  <PopoverTrigger className="border bg-blue-500">Give Feedback</PopoverTrigger>
                  <PopoverContent>
                    <Textarea placeholder="Write feedback..." />
                    {/* <button onClick={handleSendFeedback}> */}
                      <button>
                        Send
                      </button>
                  </PopoverContent>
                </Popover>
              )}

              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
