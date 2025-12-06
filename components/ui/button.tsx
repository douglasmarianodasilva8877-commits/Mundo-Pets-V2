"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none disabled:opacity-50 disabled:pointer-events-none h-10 px-4",
        "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]",
        className
      )}
    >
      {children}
    </button>
  );
}
