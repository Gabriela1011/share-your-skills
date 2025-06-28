import { VoucherType } from "./types";


export default function getNextVoucherInfoAndProgress(totalPoints: number): {
    nextVoucherType: VoucherType
    pointsToNext: number
    progress: number
} {
    if(totalPoints < 300) {
        return {
            nextVoucherType: "20",
            pointsToNext: 300 - totalPoints,
            progress: Math.floor((totalPoints / 300) * 100)
        }
    }

    if(totalPoints < 1000) {
        return {
            nextVoucherType: "100",
            pointsToNext: 1000 - totalPoints,
            progress: Math.floor(((totalPoints - 300) / 700) * 100)
        }
    }

    //totalPoints >= 1000
    const stepsOver1000 = Math.floor((totalPoints - 1000) / 500);
    
    //ultimul prag atins (ex. 1000, 1500, 2000 etc)
    const lastUnlockedThreshold = 1000 + stepsOver1000 * 500;

    //urmatorul prag pentru un nou voucher de 30%
    const nextThreshold = lastUnlockedThreshold + 500;
    const progress = totalPoints === lastUnlockedThreshold ? 0 : Math.floor(((totalPoints - lastUnlockedThreshold) / 500) * 100);
    
    return {
        nextVoucherType: "30",
        pointsToNext: nextThreshold - totalPoints,
        progress
    }
}