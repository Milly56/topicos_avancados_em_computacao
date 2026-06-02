"use client";

import React from "react";

export function Avatar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["inline-flex items-center overflow-hidden rounded-full bg-gray-100", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function AvatarFallback({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={["inline-block p-2 text-sm font-medium text-gray-700", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}

export default Avatar;
