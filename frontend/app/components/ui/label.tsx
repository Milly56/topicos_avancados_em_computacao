import * as React from "react";

export function Label({ children, htmlFor, className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label htmlFor={htmlFor} className={["block text-sm font-medium text-gray-700", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </label>
  );
}

export default Label;
