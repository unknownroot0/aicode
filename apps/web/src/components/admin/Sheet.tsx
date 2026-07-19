"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />
      {/* Inner handling for side-relative positioning if needed, but we match Sidebar.tsx left-side sheet */}
      <div className="relative">{children}</div>
    </div>
  );
}

export function SheetContent({
  side = "left",
  className,
  children,
}: {
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 z-50 flex w-full max-w-[272px] flex-col bg-white dark:bg-[#191B1F] shadow-xl transition-transform duration-300 ease-in-out",
        side === "left" && "left-0 animate-in slide-in-from-left",
        side === "right" && "right-0 animate-in slide-in-from-right",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SheetHeader({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("flex flex-col space-y-2 p-4", className)}>{children}</div>;
}

export function SheetTitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-slate-50", className)}>
      {children}
    </h2>
  );
}

export function SheetDescription({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)}>
      {children}
    </p>
  );
}
