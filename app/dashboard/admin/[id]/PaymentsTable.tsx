"use client"

import { Table, TableHeader, TableCaption, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { format } from "date-fns";
import { useEffect, useState } from "react";

type SessionPayment = {
  id: string;
  session_id: string;
  paid_at: string;
  session_price: number;
  student_discount: number;
  student_payment: number;
  teacher_earning: number;
  platform_income: number;
  commission: number;
  payment_status: 'completed' | 'no_refund_cancellation' | 'student_refunded';
};

export default function PaymentsTable() {
    const [payments, setPayments] = useState<SessionPayment[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const res = await fetch("/api/session-payments");
            const data = await res.json();
            setPayments(data);
        };

        fetchPayments();
    }, []);

    return (
        <div className="overflow-x-auto w-full xl:w-full lg:w-[750px] md:w-96 border rounded-xl bg-white">
            <Table className="w-full text-sm ">
                <TableCaption></TableCaption>
                <TableHeader className="bg-indigo-200">
                    <TableRow className="text-xs">
                        <TableHead>Paid At</TableHead>
                        <TableHead>Session Price</TableHead>
                        <TableHead>Discount (%)</TableHead>
                        <TableHead>Student Payment</TableHead>
                        <TableHead>Teacher Earning</TableHead>
                        <TableHead>Platform Income</TableHead>
                        <TableHead>Commission (%)</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{format(new Date(p.paid_at), "dd.MM.yyyy")}</TableCell>
                            <TableCell>{p.session_price} RON</TableCell>
                            {p.student_discount 
                                ? <TableCell>{p.student_discount}%</TableCell>
                                : <TableCell> 0 </TableCell>
                            }
                            <TableCell>{p.student_payment} RON</TableCell>
                            <TableCell>{p.teacher_earning} RON</TableCell>
                            <TableCell>{p.platform_income} RON</TableCell>
                            <TableCell>{p.commission}%</TableCell>
                            <TableCell className="capitalize">{p.payment_status.replace(/_/g, " ")}</TableCell>
                        </TableRow>
                    ))}
                    
                </TableBody>
            </Table>
        </div>
        
    )
}