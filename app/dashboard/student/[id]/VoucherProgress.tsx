import { Progress } from "@/components/ui/progress";
import getNextVoucherInfoAndProgress from "./getNextVoucherInfoAndProgress";
import { Gift } from "lucide-react";


export default function VoucherProgress({ totalPoints }: { totalPoints: number }) {
    const { nextVoucherType, pointsToNext, progress } = getNextVoucherInfoAndProgress(totalPoints);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-5 w-full hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">
                Your Progress
            </h2>
    
            <div className="border border-gray-100 bg-gray-50 shadow-sm rounded-lg p-4 text-sm text-gray-600">
                <div className="flex items-center">
                    <Gift className="w-5 h-5 mr-1"/> 
                        Next Voucher:
                    <span className="ml-1 font-semibold text-black rounded-full bg-red-100 px-3 py-1 text-sm">{nextVoucherType}% OFF</span> 
                </div>
                <p>
                    You need 
                    <span className="ml-1 font-semibold text-red-500 mr-1">{pointsToNext}</span> 
                    more points to unlock it.
                </p>
            </div>

            <p className="text-sm text-right text-gray-500 font-medium">
                You currently have <span className="font-bold text-xl bg-blue-100 rounded-xl p-1 shadow-md text-indigo-500">{totalPoints}</span> points.
            </p>
            <div className="relative">
                <Progress value={progress} className="h-4 shadow-md"/>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">
                    {progress} %
                </span>
            </div>
            
            <p className="text-sm text-gray-500 italic">
                Keep learning to earn points and unlock better rewards!
            </p>

            
        </div>
    )
}