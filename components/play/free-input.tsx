"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Free-text answer with a submit button. */
export function FreeInput({
  disabled,
  placeholder,
  onSubmit,
}: {
  disabled: boolean;
  placeholder: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0 || disabled) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Ta réponse"
        className="h-10"
      />
      <Button type="submit" disabled={disabled || value.trim().length === 0} className="h-10">
        Valider
      </Button>
    </form>
  );
}
