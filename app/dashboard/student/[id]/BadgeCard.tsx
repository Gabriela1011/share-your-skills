import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { StudentStatus } from "./types";


type BadgeCardProps = {
    status: StudentStatus;
    totalPoints: number
}

export default function BadgeCard({ status, totalPoints }: BadgeCardProps) {
    let message = "";
    let badge = "";

    switch(status) {
        case "Starter":
            badge = "Starter"
            message = "First steps completed – keep going!"
            break
        case "Skill Climber":
            badge = "Skill Climber"
            message = "You're climbing the mountain of knowledge!"
            break
        case "Loyal Learner":
            badge = "Loyal Learner"
            message = "1000 points! You're amazing!"
            break
        case "Master of Growth":
            badge = "Master of Growth"
            message = "You've unlocked the highest badge - a symbol of dedication and continuous learning."
    }

    return(
        <div className=" bg-white/10 p-6 rounded-2xl mb-5 shadow-md space-y-4 min-w-fit mx-auto hover:shadow-lg">
            <div className="flex gap-1">
                <Award className="w-8 h-8 text-indigo-600 animate-pulse"/>
                <Badge className="text-lg px-3">
                    {badge}
                </Badge>
            </div>
            <p className="text-sm text-gray-600 italic">{message}</p>
        </div>
    )
}