"use client"

import AvailableSlotsList from "@/components/myComponents/AvailableSlotsList";
import { SlotsProps } from "@/components/myComponents/AddTimeSlot";
import { useEffect, useState } from "react";
import Spinner from "@/components/myComponents/Spinner";
import { toast } from "sonner";
import { formatDate } from "@/components/myComponents/AvailableSlotsList";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog"
import Vouchers from "../../rewards/Vouchers";
import { Voucher } from "../../types";
import { useRouter } from "next/navigation";

export interface SelectSlotProps {
  teacherSkillId: string;
  studentId: string;
  price: number;
}



export default function SelectSlot({ teacherSkillId, studentId, price }: SelectSlotProps){
    const [slots, setSlots] = useState<SlotsProps[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<SlotsProps | null>(null)
    const [showVouchers, setShowVouchers] = useState(false);
    const [sessionPrice, setSessionPrice] = useState(price);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
   // const [loadingPayment, setLoadingPayment] = useState(false);

   const router = useRouter();

    useEffect(() => {
        async function fetchSlots() {
            try{
                const res = await fetch(`/api/teacherSkills/${teacherSkillId}/slots`);
                
                if (!res.ok) 
                    throw new Error("Failed to fetch slots");

                const data = await res.json();
                setSlots(data);
                
            }catch(error) {
                console.error(error);
                toast.error("Error fetching slots");
            } finally {
                setLoading(false);
            }
        }

        fetchSlots();
    }, [teacherSkillId])

    const handleSlotClick = (slot: SlotsProps) => {
        setSelectedSlot(slot);
        setShowDialog(true)
    };

    const applyVoucher = (voucher: Voucher) => {
        //pt vizibilitatea tranzitiei
        setTimeout(() => {
            const discount = parseInt(voucher.type);
            const newPrice = Math.floor(price * (1 - discount / 100));
            setSessionPrice(newPrice);
            setSelectedVoucher(voucher);
        }, 0)
    }

    const removeVoucher = () => {
        setSessionPrice(price);
        setSelectedVoucher(null);
    }

    
    const handlePayment = async () => {
        if (!selectedSlot || !studentId || !teacherSkillId) return;

        try{
            //setLoadingPayment(true);
            const res = await fetch("/api/sessionAndsession_payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slotId: selectedSlot.id,
                    studentId,
                    teacherSkillId,
                    voucherId: selectedVoucher?.id ?? null,
                    voucherType: selectedVoucher?.type ?? null,
                    sessionPrice: price,
                    finalPrice: sessionPrice
                })
            })

            if (!res.ok) throw new Error("Payment failed");
            
            //marcheaza slotul ca rezervat in baza de date
             const patchRes = await fetch("/api/sessionAndsession_payments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slotId: selectedSlot.id })
            });

            if (!patchRes.ok) throw new Error("Failed to update slot booking status");


            toast.success("Payment registered successfully!");
            setShowDialog(false); 

        }catch(err){
            console.error("Payment error:", JSON.stringify(err, null, 2));

            toast.error("Something went wrong during payment.");
        // } finally {
        //     setLoadingPayment(false);
        // }
        }
    }

    if(loading) return <Spinner />

    return(
        <>
            <AvailableSlotsList slots={slots} isStudent={true} click={handleSlotClick}/>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book a session</DialogTitle>
                        <DialogDescription>
                            <span className="mt-4 text-xl font-semibold">Price: {sessionPrice && `${sessionPrice} RON`}</span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedSlot?.date && <p>Date: {formatDate(selectedSlot.date)}</p>}
                    <p>{selectedSlot?.hour_start.slice(0, 5)} - {selectedSlot?.hour_end.slice(0, 5)}</p>

                    <button
                        className="mt-4 p-2 bg-blue-200 rounded-md hover:bg-indigo-200"
                        onClick={() => setShowVouchers(prev => !prev)}
                    >
                       {showVouchers ? "Hide vouchers" : "Select voucher"} 
                    </button>
                    
                    {showVouchers && 
                        <Vouchers 
                            isDialogView={true} 
                            onSelectVoucher={applyVoucher} 
                            selectedVoucher={selectedVoucher} 
                            onDeselectVoucher={removeVoucher}
                        />
                    }
                    

                    <button 
                        className="p-2 mt-4 rounded-md bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-semibold hover:shadow-xl hover:text-black"
                        onClick={handlePayment}
                    >
                        
                        {/* {loadingPayment ? <Spinner /> : "Make payment"} */}
                        Make Payment
                    </button>
                </DialogContent>
            </Dialog>
        </>
    )
}