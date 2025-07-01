

"use client"

import { useState } from "react"
import { format, isSameDay } from "date-fns"
import "react-day-picker/style.css"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { TeacherCalendarSession } from "./types"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { SessionStatus } from "@/app/dashboard/types"

export const statusColor: Record<SessionStatus, string> = {
  scheduled: "bg-blue-500",
  cancelled: "bg-red-500",
  cancellation_with_refund: "bg-orange-500",
  completed: "bg-green-500",
}

interface TeacherCalendarProps {
  sessions: TeacherCalendarSession[]
}



export default function TeacherCalendar({ sessions }: TeacherCalendarProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState<
    "scheduled" | "cancelled" | "completed" | "cancellation_with_refund" | null
  >(null)
  //state feedback

  const openDialog = (date: Date, status: typeof selectedStatus) => {
    setSelectedDate(date)
    setSelectedStatus(status)
    setOpen(true)
  }

  const sessionsForDay = sessions.filter(
    (session) =>
      selectedDate &&
      isSameDay(new Date(session.available_slots.date), selectedDate) &&
      session.status === selectedStatus
  )

  const handleSendFeedback = async () => {

  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={() => {}}
        showOutsideDays
        className="rounded-md border shadow-md w-fit bg-white p-4"
        modifiersClassNames={{
          selected: "bg-primary",
          today: "text-blue-600",
        }}
        components={{
           DayButton: ({ day }) => {

            const sessionsForThisDay = sessions.filter((s) =>
              isSameDay(new Date(s.available_slots.date), day.date)
            )

            const uniqueStatuses = Array.from(
              new Set(sessionsForThisDay.map((s) => s.status))
            ) as (
              | "scheduled"
              | "cancelled"
              | "completed"
              | "cancellation_with_refund"
            )[]

            return (
              <div
                className="w-full h-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{format(day.date, "d")}</span>
                <div className="flex gap-[2px] mt-1 flex-wrap justify-center">
                  {uniqueStatuses.map((status) => (
                    <DialogTrigger key={status} asChild>
                      <button
                        className={`w-2 h-2 rounded-full ${statusColor[status]} cursor-pointer hover:scale-125 transition-transform`}
                        aria-label={status}
                        onClick={(e) => {
                          e.stopPropagation()
                          openDialog(day.date, status)
                        }}
                      />
                    </DialogTrigger>
                  ))}
                </div>
              </div>
            )
          },
        }}
      />

       <DialogContent>
         <DialogTitle>
           {selectedStatus} sessions –{" "}
           {selectedDate ? format(selectedDate, "dd.MM.yyyy") : ""}
         </DialogTitle>
        
        <DialogDescription></DialogDescription>
        
         <div className="mt-4 space-y-2">
           {sessionsForDay.length !== 0 && (
            sessionsForDay.map((session) => (
              <div key={session.id} className="border p-2 rounded bg-white/70">
                <div className="flex justify-between">
                  <div>
                    <strong>{session.teacher_skills.skills.skill}</strong>
                    <p className="text-sm text-muted-foreground">
                      Student: {session.student_profiles.users.full_name}
                    </p>
                  </div>
                  
                  <div className="flex flex-col">
                    <span>
                      {format(
                        new Date(`1970-01-01T${session.available_slots.hour_start}`),
                        "HH:mm"
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(`1970-01-01T${session.available_slots.hour_end}`),
                        "HH:mm"
                      )}
                    </span>
                    
                    {selectedStatus === "completed" && (
                      <Popover>
                        <PopoverTrigger className="border">Give Feedback</PopoverTrigger>
                        <PopoverContent>
                          <Textarea placeholder="Write feedback..." />
                          <button onClick={handleSendFeedback}>
                            Send
                          </button>
                        </PopoverContent>
                      </Popover>
                    )}
                    
                  </div>
                 
                </div>
                
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

