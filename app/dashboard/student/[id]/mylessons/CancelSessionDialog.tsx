"use client"

import { useState } from "react"
import { toast } from "sonner";
import { isLessThan48HoursAway } from "./isLessThan48HoursAway";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CancelProps = {
  sessionId: string;
  date: string;
  hourStart: string;
};

export default function CancelSessionDialog({ sessionId, date, hourStart }: CancelProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const lessThan48h = isLessThan48HoursAway(date, hourStart);

  const handleCancel = async () => {
    //daca lessThan48h este true => refund = false
    //lessThan48h este false => refund = true

    const res = await fetch("/api/cancel-session", {
      method: "POST",
      body: JSON.stringify({ sessionId, refund: !lessThan48h }),
    });

    if (res.ok) {
      const data = await res.json();

      if(data.refundGiven) {
        toast.success("Session cancelled. You have received a full refund.");
      } else {
        toast.success("Session cancelled. No refund was issued.");
      }

      setOpen(false);
      router.refresh();
    } else {
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">Cancel session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Are you sure you want to cancel?
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-700">
          {lessThan48h
            ? "If you cancel less than 48 hours before the session, you will not receive a refund. Do you want to proceed?"
            : "If you cancel now, you will receive a full refund. Do you want to proceed?"}
        </DialogDescription>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Go back</Button>
          <Button variant="destructive" onClick={handleCancel}>Confirm Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}