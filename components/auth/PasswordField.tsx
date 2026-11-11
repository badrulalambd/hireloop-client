"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type PasswordFieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  placeholder?: string
  required?: boolean
  minLength?: number
  className?: string
}

const PasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  required = true,
  minLength,
  className,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="h-9 pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-1 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  )
}

export default PasswordField
