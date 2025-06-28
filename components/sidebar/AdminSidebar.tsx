"use client"

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

export default function AdminSidebar({ id }: { id: string }) {
    const pathname = usePathname();

  const links = [
    {
      href: `/dashboard/admin/${id}`,
      label: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/admin/${id}/users`,
      label: "Users",
      icon: <UserPen className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/admin/${id}/sessions`,
      label: "Sessions",
      icon: <Search className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/admin/${id}/subscriptions`,
      label: "Subscriptions",
      icon: <BookOpenCheck className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/admin/${id}/vouchers`,
      label: "Student Vouchers",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/admin/${id}/feedback`,
      label: "Feedback",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
     {
      href: `/dashboard/admin/${id}/userreports`,
      label: "Reports",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/admin/${id}/income`,
      label: "Income",
      icon: <Gift className="mr-2 h-4 w-4" />,
    },
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