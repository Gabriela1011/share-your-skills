"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  Users,
  UserPen,
  BookOpenCheck,
  CalendarDays,
  CalendarSync,
  Gift,
  BarChart,
  Bell,
  MessageCircle,
  Star,
  Heart,
} from "lucide-react";
import { ReactElement } from "react";

type LinkItem = {
  href: string;
  label: string;
  icon: ReactElement;
}

export default function TeacherSidebar({ id, subscriptionType }: { id: string; subscriptionType: "FREE" | "BASIC" | "PRO" | null; }) {
  const pathname = usePathname();

  const links = [
    {
      href: `/dashboard/teacher/${id}`,
      label: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/teacher/${id}/profile`,
      label: "My Profile",
      icon: <UserPen className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/teacher/${id}/mylessons`,
      label: "My Lessons",
      icon: <BookOpenCheck className="mr-2 h-4 w-4" />,
    },
    ...(subscriptionType !== "FREE"
      ? [
          {
            href: `/dashboard/teacher/${id}/sessionscalendar`,
            label: "Calendar",
            icon: <CalendarDays className="mr-2 h-4 w-4" />,
          }
        ]
      : []),
    {
      href: `/dashboard/teacher/${id}/feedback`,
      label: "Feedback Received",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/teacher/${id}/earnings`,
      label: "Earnings & Payouts",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      href: `/dashboard/teacher/${id}/subscriptions`,
      label: "Subscriptions",
      icon: <CalendarSync className="mr-2 h-4 w-4" />,
    },
  ]

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
