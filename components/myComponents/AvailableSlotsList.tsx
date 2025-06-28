"use client"

import { CalendarDays, Clock } from "lucide-react";
import { SlotsProps } from "./AddTimeSlot";
import { revalidatePath } from "next/cache";

export function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export interface SlotListProps {
    slots: SlotsProps[] | null;
    isStudent: boolean;
    click?: (slot: SlotsProps) => void;
}

export default function AvailableSlotsList({ slots, isStudent, click }: SlotListProps) {
    if (!slots || slots.length === 0) 
        return <p>No available slots yet.</p>;

    return(
        <div className="mt-6 space-y-2 w-full">
            {isStudent ? <h2 className="font-semibold mb-2">Choose an available slot</h2> : <h2 className="font-semibold mb-2">Your available time slots</h2>}
            
            {slots.map((slot) => (
                <div 
                    key={slot.id} 
                    className={`flex justify-between items-center w-full px-4 py-2 border text-sm rounded-md shadow-sm bg-white/70 ${
                        isStudent ? 'cursor-pointer hover:bg-blue-50' : ''
                    } `}
                    onClick={() => isStudent && click?.(slot)}
                >
                    <div className="flex gap-2 items-center text-gray-800">
                        <CalendarDays className="w-4 h-4"/>
                        {formatDate(slot.date)}
                    </div>
                    <div className="flex gap-2 items-center text-gray-800 tabular-nums">
                        <Clock className="w-4 h-4" />
                        {slot.hour_start.slice(0, 5)} - {slot.hour_end.slice(0, 5)}
                    </div>
                </div> 
            ))}
        </div>
    ) 
}