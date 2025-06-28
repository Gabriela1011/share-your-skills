import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    url?: string;
}

export default function Logo({ url = "/" }: LogoProps) {
    return (
        <Link href={url} className="flex items-center gap-2">               
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                <span className="hidden sm:block ml-1 text-lg font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 text-transparent bg-clip-text drop-shadow-sm opacity-80 hover:opacity-100 transition duration-300">
                        ShareYourSkills
                </span>
        </Link>
    );
}