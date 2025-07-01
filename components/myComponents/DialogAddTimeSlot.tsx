import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddTimeSlot, { SlotsProps } from "./AddTimeSlot";

export default function DialogAddTimeSlot({ slots }: { slots: SlotsProps[] | null }){
    return(
        <Dialog modal={false}>
        <DialogTrigger className="p-2 mt-4 rounded-md bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-semibold hover:shadow-xl hover:text-black">
            Add Time Slot
        </DialogTrigger>
        
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Available Time Slots</DialogTitle>
                <DialogDescription>
                    Select a date and start time to create a new slot.
                </DialogDescription>
                <AddTimeSlot slots={slots} />
            </DialogHeader>
        </DialogContent>
        </Dialog>
    )
}
