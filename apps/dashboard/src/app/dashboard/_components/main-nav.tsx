"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/utils";

const navigation = [
  { name: "Tasks", href: "/dashboard" },
  { name: "Planner", href: "/dashboard/planner" },
  { name: "Activity", href: "/dashboard/activity" },
  { name: "Settings", href: "/dashboard/settings" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            pathname === item.href ? "text-default" : "text-muted-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
