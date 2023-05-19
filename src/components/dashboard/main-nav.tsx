"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

const links = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
  },
  {
    label: "Sales",
    href: "/dashboard/sales",
  },
];

type NavLink = (typeof links)[number];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { pathname } = useRouter();

  const isCurrentPath = (link: NavLink) => link.href === pathname;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={
            `text-sm font-medium transition-colors hover:text-primary ` +
            (isCurrentPath(link) ? "" : "text-muted-foreground")
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
