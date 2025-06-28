"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  UserPen,
  BookOpenCheck,
  CalendarDays,
  Gift,
  BarChart,
  Bell,
  MessageCircle,
  Star,
  Heart,
} from "lucide-react";

export default function StudentSidebar({ id }: { id: string }) {
  const pathname = usePathname();

  const links = [
    {
      href: `/dashboard/student/${id}`,
      label: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/student/${id}/profile`,
      label: "My Profile",
      icon: <UserPen className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/student/${id}/learnskill`,
      label: "Learn A New Skill",
      icon: <Search className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/student/${id}/mylessons`,
      label: "My Lessons",
      icon: <BookOpenCheck className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/student/${id}/feedback`,
      label: "Feedback Received",
      icon: <Star className="mr-2 h-4 w-4" />,
    },

    {
      href: `/dashboard/student/${id}/rewards`,
      label: "Vouchers",
      icon: <Gift className="mr-2 h-4 w-4" />,
    },
    // {
    //   href: `/dashboard/student/${id}/progress`,
    //   label: "Progress",
    //   icon: <BarChart className="mr-2 h-4 w-4" />,
    // },
    // {
    //   href: `/dashboard/student/${id}/wishlist`,
    //   label: "Wishlist",
    //   icon: <Heart className="mr-2 h-4 w-4" />,
    // },
  ];

  return (
    <div className="flex flex-col gap-2">
      {links.map(({ href, label, icon }) => (
        <Button
          key={href}
          variant={pathname === href ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          <Link href={href} className="flex items-center">
            <span className="opacity-50">{icon}</span>
            {label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
