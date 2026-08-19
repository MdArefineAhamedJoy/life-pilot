import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  center = false,
}: {
  children: string;
  center?: boolean;
}) {
  return (
    <span className={`life-eyebrow ${center ? "life-eyebrow-center" : ""}`}>
      {children}
    </span>
  );
}

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="life-btn life-btn-primary" href={href}>
      {children}
    </Link>
  );
}

export function GhostLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="life-btn life-btn-ghost" href={href}>
      {children}
    </Link>
  );
}
