import * as React from "react";

export function Badge({ children, className = "", ...props }: any) {
  return (
    <span className={["inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-800", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}

export default Badge;
