import Image from "next/image"
import { CircleUserRound } from "lucide-react"
import Link from "next/link";

interface UserAvatarProps {
    src?: string;
    id: string;
    role: "teacher" | "student";
}


export default function UserAvatar({ src, id, role }: UserAvatarProps) {
    
    const profileURL = `/dashboard/${role}/${id}/profile`;
    
    return (
        <Link href={profileURL} className="hover: opacity-80 transition">
            
            {src ? (
                    <img
                        src={src}
                        alt="Profile picture"
                        width={32}
                        height={32}
                        className="rounded-full object-cover border"
                    />
                ) : (
                    <CircleUserRound size={32} color="#61adff" strokeWidth={1.75} />
                )
            }
            
        </Link>
    );
    
    
   
}