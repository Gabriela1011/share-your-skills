"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Voucher } from "../types";
import { BadgePercent } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Spinner from "@/components/myComponents/Spinner";


export default function Vouchers({
    isDialogView,
    onSelectVoucher,
    selectedVoucher,
    onDeselectVoucher 
}: { 
    isDialogView?: boolean,
    onSelectVoucher?: (voucher: Voucher) => void,
    selectedVoucher?: Voucher | null,
    onDeselectVoucher?: () => void
}) {
    const [vouchers, setVouchers] = useState<Voucher[] | null>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVouchers() {
            try{
                const res = await fetch("/api/vouchers");
                const data = await res.json();
                setVouchers(data.vouchers || []);
            } catch (err) {
                console.error("Failed to fetch vouchers", err);
            } finally {
                setLoading(false);
            }
        }

        fetchVouchers();
    }, []);

    const getVoucherColor = (type: Voucher["type"]) => {
        switch (type) {
            case "10": return "bg-indigo-100 text-indigo-800"
            case "20": return "bg-yellow-100 text-yellow-800"
            case "30": return "bg-green-100 text-green-800"
            case "100": return "bg-pink-100 text-pink-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getLabel = (type: Voucher["type"]) => {
        switch (type) {
            case "10": return "10% Welcome Voucher"
            case "20": return "20% Reward Voucher"
            case "30": return "30% Milestone Voucher"
            case "100": return "100% Free Session"
            default: return ""
        }
    }
    
    if(loading) return <Spinner />

    return (
        <div className={cn(isDialogView ? "py-1" : "py-10 px-4")}>
            {vouchers?.length === 0 ? (
                <p className="text-center text-gray-500 font-semibold">No vouchers available at the moment.</p>
            ) : (
                <div
                    className={cn(
                    "grid gap-4",
                    isDialogView ? "grid-cols-1" : "sm:grid-cols-2"
                    )}
                >
                    {vouchers?.map((voucher) => (
                        <Card
                            key={voucher.id}
                            className={cn(
                            "rounded-xl transition-all hover:scale-[1.02]",
                            isDialogView && "text-sm p-1",
                            getVoucherColor(voucher.type),
                            selectedVoucher?.id === voucher.id 
                            ? "border-4 border-blue-300 shadow-xl scale-[1.03]"
                            : "shadow-md"
                        )}>
                            <CardContent className={cn(isDialogView ? "text-sm p-1 space-y-2" : "p-6 space-y-4")}>
                                <div className="flex items-center gap-3">
                                    <BadgePercent className="w-6 h-6" />
                                    <span className="text-md font-bold">
                                        {getLabel(voucher.type)}
                                    </span>
                                </div>
                                
                                {!isDialogView && (
                                    <span>Issued on: {format(new Date(voucher.created_at), "dd.MM.yyyy")}</span>
                                )}
                                
                            </CardContent>

                            {isDialogView && (
                                <CardFooter className={cn(isDialogView && "p-2")}>
                                    {selectedVoucher?.id === voucher.id ? (
                                        <button
                                            className="border bg-red-100 py-1 px-2 rounded-full text-red-700 hover:shadow-2xl"
                                            onClick={onDeselectVoucher}
                                        >
                                            Deselect voucher
                                        </button>
                                    ) : (
                                        <button 
                                            className="border bg-gray-50 py-1 px-2 rounded-full hover:text-red-400"
                                            onClick={() => onSelectVoucher?.(voucher)}
                                        >
                                            Use voucher
                                        </button>
                                    )}
                                    
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}