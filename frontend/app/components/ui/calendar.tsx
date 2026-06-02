import * as React from "react";

// Minimal placeholder Calendar component. Real implementation may be added later.
export function Calendar(props: any) {
  return <div {...props} className={["border rounded p-2", props.className].filter(Boolean).join(" ")}>Calendar</div>;
}

export default Calendar;
