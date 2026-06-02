"use client";

import React from "react";

export function Switch({ checked, onCheckedChange, className = "", ...props }: any) {
  return (
    <label className={["inline-flex items-center cursor-pointer", className].filter(Boolean).join(" ")}>
      <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} {...props} className="sr-only" />
      <span className="w-10 h-6 bg-gray-300 rounded-full relative inline-block" />
    </label>
  );
}

export default Switch;
