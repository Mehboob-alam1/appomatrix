"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "warm";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  analyticsLabel?: string;
  analyticsLocation?: string;
};

const variants = {
  primary: "btn-gradient border-0",
  warm:
    "bg-accent-secondary text-white hover:brightness-110 shadow-md shadow-accent-secondary/30",
  secondary:
    "border-2 border-accent/20 bg-surface text-foreground hover:border-accent/50 hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface-muted",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  disabled,
  analyticsLabel,
  analyticsLocation = "unknown",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  const handleClick = () => {
    if (analyticsLabel) {
      trackCtaClick(analyticsLabel, analyticsLocation);
    }
    onClick?.();
  };

  if (href) {
    return (
      <Link href={href} className={classes} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
}
