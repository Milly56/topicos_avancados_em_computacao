"use client";

import React, { createContext, useContext } from "react";

type RadioContextValue = { value?: string; onValueChange?: (v: string) => void; disabled?: boolean };
const RadioContext = createContext<RadioContextValue>({});

export function RadioGroup({ value, onValueChange, disabled, children, className = "" }: any) {
  return (
    <RadioContext.Provider value={{ value, onValueChange, disabled }}>
      <div className={className}>{children}</div>
    </RadioContext.Provider>
  );
}

export function RadioGroupItem({ value, id, disabled }: { value: string; id?: string; disabled?: boolean }) {
  const ctx = useContext(RadioContext);
  const checked = ctx.value === value;
  return (
    <input
      id={id}
      type="radio"
      checked={checked}
      disabled={disabled || ctx.disabled}
      onChange={() => ctx.onValueChange?.(value)}
      className="form-radio"
    />
  );
}

export default RadioGroup;
