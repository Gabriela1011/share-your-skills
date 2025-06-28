"use client";

import * as React from "react";
import { CalendarDays, ChevronDownIcon, Clock } from "lucide-react";
import { useState, useActionState, useEffect } from "react";
import { saveSlot } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import AvailableSlotsList from "./AvailableSlotsList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Spinner from "./Spinner";


export interface SlotsProps {
  id:string;
  date: string;
  hour_end: string;
  hour_start: string;
  is_booked: boolean;
  dateTime?: Date;
}


export default function AddTimeSlot({ slots }: { slots: SlotsProps[] | null }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [state, action, isPending] = useActionState(saveSlot, null);


  useEffect(() => {
    if(!state) return;
    
    if (state?.success === true) {
      toast.success(state?.message)
    } else {
      toast.error(state?.message)
    }
    }, [state]);

  return (
    <>
      <form action={action} className="flex flex-wrap gap-6 pt-4 p-4 rounded-lg border bg-white/60 shadow-sm">
        <div className="flex justify-start gap-3 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date-picker" className="px-1">
              Date
            </Label>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-32 justify-between font-normal bg-white/70"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
                
              </PopoverContent>
            </Popover>
          </div>

          {date && (
            <input type="hidden" name="date"  value={date.toLocaleDateString("sv-SE")} />
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="time-picker" className="px-1">
              Start Time
            </Label>
            <Input
              type="time"
              name="hour_start"
              id="time-picker"
              defaultValue="10:30"
              step={60}
              required
              className="bg-white/70 appearance-none w-32 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          
          
          <button 
            className="border bg-blue-200 p-1 mb-1 rounded-md shadow-sm hover:shadow-lg hover:bg-blue-300 self-end ml-auto"
            type="submit"
          >
            Save Slot { isPending  && <Spinner/> }
          </button>
          
        </div>

        <div className="text-sm text-gray-600 bg-white/70 rounded-md p-2 shadow-md">
          The duration of each session is 90 minutes.
        </div>
      </form>

      <AvailableSlotsList slots={slots} isStudent={false}/>
      
    </>
  );
}

